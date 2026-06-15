import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Category, CartItem, Order, OrderItem, Review, UserProfile } from '../types';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../seed';

interface AppContextType {
  // Auth
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  authLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  // Profile management
  saveAddress: (address: string) => Promise<void>;
  removeAddress: (address: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;

  // Store data (Real-time snapshots)
  products: Product[];
  categories: Category[];
  orders: Order[];
  reviews: Review[];
  storeLoading: boolean;

  // Shopping Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Checkout & Reviews
  placeOrder: (details: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    city: string;
    shippingAddress: string;
    paymentMethod: string;
  }) => Promise<string>;
  submitReview: (productId: string, rating: number, comment: string) => Promise<void>;
  getProductReviews: (productId: string) => Review[];

  // Admin capabilities
  adminAddProduct: (productData: Omit<Product, 'productId' | 'createdAt' | 'updatedAt' | 'ratings' | 'reviewsCount'>) => Promise<void>;
  adminEditProduct: (productId: string, productData: Partial<Product>) => Promise<void>;
  adminDeleteProduct: (productId: string) => Promise<void>;
  adminUpdateStockPrice: (productId: string, price: number, salePrice: number | null, stock: number) => Promise<void>;
  adminAddCategory: (categoryData: Omit<Category, 'categoryId'>) => Promise<void>;
  adminDeleteCategory: (categoryId: string) => Promise<void>;
  adminUpdateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  adminDeleteOrder: (orderId: string) => Promise<void>;
  customerUpdateOrderStatus: (orderId: string, status: 'cancelled' | 'processing') => Promise<void>;
  allUsers: UserProfile[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [storeLoading, setStoreLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('kitchen_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to local storage
  useEffect(() => {
    localStorage.setItem('kitchen_cart', JSON.stringify(cart));
  }, [cart]);

  // Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Sync custom user profile from Firestore or create one
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        let userDocSnap;
        try {
          userDocSnap = await getDoc(userDocRef);
        } catch (error) {
          // If security rules reject, handle or catch
          console.error('Error fetching user profile doc', error);
        }

        if (userDocSnap && userDocSnap.exists()) {
          const profile = userDocSnap.data() as UserProfile;
          setUserProfile(profile);
          setIsAdmin(profile.role === 'admin' || firebaseUser.email === 'ahemadkh832@gmail.com');
        } else {
          // Create default customer profile
          const isBootstrapAdmin = firebaseUser.email === 'ahemadkh832@gmail.com';
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Customer',
            photoURL: firebaseUser.photoURL || '',
            role: isBootstrapAdmin ? 'admin' : 'customer',
            wishlist: [],
            addresses: [],
            createdAt: new Date().toISOString()
          };
          try {
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
            setIsAdmin(isBootstrapAdmin);
            
            // If bootstrap admin, also register in "admins" list
            if (isBootstrapAdmin) {
              await setDoc(doc(db, 'admins', firebaseUser.uid), {
                uid: firebaseUser.uid,
                email: firebaseUser.email
              });
            }
          } catch (err) {
            console.error('Graceful recovery from Firestore user creation failure:', err);
            // Fallback to local session representation to prevent fatal crash
            setUserProfile(newProfile);
            setIsAdmin(isBootstrapAdmin);
          }
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const seedingInProgress = React.useRef(false);

  // Real-time Database Sync (and auto-seeding if completely empty)
  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const item = { productId: docSnap.id, ...docSnap.data() } as Product;
        // Keep prices aligned to pre-seeded PKR values if they are old USD values (< 1000)
        if (item.price < 1000) {
          const seedProd = SEED_PRODUCTS.find(p => p.productId === item.productId);
          if (seedProd) {
            item.price = seedProd.price;
            item.salePrice = seedProd.salePrice || null;
          }
        }
        items.push(item);
      });
      setProducts(items);

      // Seed if products is completely empty
      if (snapshot.empty && !seedingInProgress.current) {
        seedingInProgress.current = true;
        triggerAutoSeeding().finally(() => {
          seedingInProgress.current = false;
        });
      }
      setStoreLoading(false);
    }, (error) => {
      console.warn("Products read subscription warning: ", error);
      setStoreLoading(false);
    });

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const items: Category[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ categoryId: docSnap.id, ...docSnap.data() } as Category);
      });
      setCategories(items);
    }, (error) => {
      console.warn("Categories read subscription warning: ", error);
    });

    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      const items: Review[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ reviewId: docSnap.id, ...docSnap.data() } as Review);
      });
      setReviews(items);
    }, (error) => {
      console.warn("Reviews read subscription warning: ", error);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubReviews();
    };
  }, []);

  // Real-time Orders Sync based on role
  useEffect(() => {
    let unsubOrders = () => {};

    if (user) {
      const ordersCol = collection(db, 'orders');
      const orderQuery = isAdmin 
        ? query(ordersCol, orderBy('createdAt', 'desc'))
        : query(ordersCol, where('userId', '==', user.uid));

      unsubOrders = onSnapshot(orderQuery, (snapshot) => {
        const items: Order[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ orderId: docSnap.id, ...docSnap.data() } as Order);
        });
        setOrders(items);
      }, (error) => {
        console.error('Snapshot orders read error ignored during transitions', error);
      });
    } else {
      setOrders([]);
    }

    return () => unsubOrders();
  }, [user, isAdmin]);

  // Sync users list if Admin
  useEffect(() => {
    let unsubUsers = () => {};

    if (user && isAdmin) {
      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const items: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as UserProfile);
        });
        setAllUsers(items);
      }, (error) => {
        console.error('Error fetching entire user base for admin panel', error);
      });
    } else {
      setAllUsers([]);
    }

    return () => unsubUsers();
  }, [user, isAdmin]);

  // Auto Seeding Function with individual write-fault tolerance
  const triggerAutoSeeding = async () => {
    console.log('Database empty on initial load. Starting standard products & categories seeding...');
    
    // Seed Categories
    for (const cat of SEED_CATEGORIES) {
      try {
        const ref = doc(db, 'categories', cat.categoryId);
        await setDoc(ref, {
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          imageUrl: cat.imageUrl || ''
        });
        console.log(`Successfully pre-seeded category: ${cat.categoryId}`);
      } catch (err) {
        console.warn(`Category seeding skipped or already exists for ${cat.categoryId}:`, err);
      }
    }

    // Seed Products
    for (const prod of SEED_PRODUCTS) {
      try {
        const ref = doc(db, 'products', prod.productId);
        await setDoc(ref, {
          ...prod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log(`Successfully pre-seeded product: ${prod.productId}`);
      } catch (err) {
        console.warn(`Product seeding skipped or already exists for ${prod.productId}:`, err);
      }
    }
    console.log('Standard seed sequence completed.');
  };

  // Auth Methods
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Auth Failed', error);
      throw error;
    }
  };

  const registerWithEmail = async (email: string, password: string, name: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Custom profile creation is handled in the onAuthStateChanged triggers
      const newUserDoc = doc(db, 'users', cred.user.uid);
      await setDoc(newUserDoc, {
        uid: cred.user.uid,
        email,
        displayName: name,
        role: email === 'ahemadkh832@gmail.com' ? 'admin' : 'customer',
        wishlist: [],
        addresses: [],
        createdAt: new Date().toISOString()
      });
    } catch (error: any) {
      if (error && error.message && error.message.includes('auth/operation-not-allowed')) {
        console.warn('Email Registration Failed - Provider not enabled in console', error);
      } else {
        console.error('Email Registration Failed', error);
      }
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error && error.message && error.message.includes('auth/operation-not-allowed')) {
        console.warn('Email Login Failed - Provider not enabled in console', error);
      } else {
        console.error('Email Login Failed', error);
      }
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password Reset Failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign Out Failed', error);
    }
  };

  // Wishlist and Address Management (Self profile update)
  const toggleWishlist = async (productId: string) => {
    if (!user || !userProfile) throw new Error('Authentication required to update wishlist');

    const currentList = userProfile.wishlist || [];
    const isLiked = currentList.includes(productId);
    const updatedList = isLiked
      ? currentList.filter(id => id !== productId)
      : [...currentList, productId];

    const ref = doc(db, 'users', user.uid);
    try {
      await updateDoc(ref, { wishlist: updatedList });
      setUserProfile({ ...userProfile, wishlist: updatedList });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const saveAddress = async (address: string) => {
    if (!user || !userProfile) throw new Error('Authentication required to save addresses');
    const addresses = userProfile.addresses || [];
    if (addresses.includes(address)) return; // duplicate

    const updated = [...addresses, address];
    const ref = doc(db, 'users', user.uid);
    try {
      await updateDoc(ref, { addresses: updated });
      setUserProfile({ ...userProfile, addresses: updated });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const removeAddress = async (address: string) => {
    if (!user || !userProfile) throw new Error('Authentication required to remove addresses');
    const addresses = userProfile.addresses || [];
    const updated = addresses.filter(a => a !== address);

    const ref = doc(db, 'users', user.uid);
    try {
      await updateDoc(ref, { addresses: updated });
      setUserProfile({ ...userProfile, addresses: updated });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stockQuantity <= 0) return;

    setCart((prev) => {
      const idx = prev.findIndex(item => item.product.productId === product.productId);
      if (idx > -1) {
        const item = prev[idx];
        const newQty = Math.min(item.quantity + quantity, product.stockQuantity);
        const updated = [...prev];
        updated[idx] = { ...item, quantity: newQty };
        return updated;
      } else {
        return [...prev, { product, quantity: Math.min(quantity, product.stockQuantity) }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      const idx = prev.findIndex(item => item.product.productId === productId);
      if (idx > -1) {
        const item = prev[idx];
        const limited = Math.max(1, Math.min(quantity, item.product.stockQuantity));
        const updated = [...prev];
        updated[idx] = { ...item, quantity: limited };
        return updated;
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => {
    const itemPrice = item.product.salePrice ?? item.product.price;
    return total + itemPrice * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // checkout - creates an order and updates stock count
  const placeOrder = async (details: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    city: string;
    shippingAddress: string;
    paymentMethod: string;
  }): Promise<string> => {
    const { customerName, customerEmail, customerPhone, city, shippingAddress, paymentMethod } = details;
    if (!user) throw new Error('Sign in required to place orders');
    if (cart.length === 0) throw new Error('Cart is empty!');

    const orderId = 'ord_' + Math.random().toString(36).substr(2, 9);
    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.product.productId,
      productName: item.product.name,
      price: item.product.salePrice ?? item.product.price,
      quantity: item.quantity,
      image: item.product.images[0] || ''
    }));

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

    const orderPayload: Order = {
      orderId,
      userId: user.uid,
      customerEmail,
      customerName,
      customerPhone,
      city,
      shippingAddress,
      paymentMethod,
      items: orderItems,
      totalAmount: cartTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // Specific fields required by user prompt
      orderedProducts: orderItems,
      quantity: totalQty,
      orderDate: new Date().toISOString(),
      orderStatus: 'pending'
    };

    try {
      // 1. Save all customer information to Firebase Firestore (User profile)
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: customerEmail,
        displayName: customerName,
        role: userProfile?.role || 'customer',
        createdAt: userProfile?.createdAt || new Date().toISOString(),
        phone: customerPhone,
        city: city,
        addresses: userProfile?.addresses?.includes(shippingAddress)
          ? userProfile.addresses
          : [...(userProfile?.addresses || []), shippingAddress]
      });

      // 2. Write the order
      await setDoc(doc(db, 'orders', orderId), orderPayload);

      // 3. Decrement stocks for all items in the batch
      const batch = writeBatch(db);
      for (const item of cart) {
        const productRef = doc(db, 'products', item.product.productId);
        const currentStock = products.find(p => p.productId === item.product.productId)?.stockQuantity || 0;
        const newStock = Math.max(0, currentStock - item.quantity);
        const status = newStock === 0 ? 'out_of_stock' : 'active';
        batch.update(productRef, {
          stockQuantity: newStock,
          status: status,
          updatedAt: new Date().toISOString()
        });
      }
      await batch.commit();

      // Clear layout cart
      clearCart();

      return orderId;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
    }
  };

  // Submit dynamic Reviews
  const submitReview = async (productId: string, rating: number, comment: string) => {
    if (!user) throw new Error('Authentication required to submit review');

    const reviewId = 'rev_' + Math.random().toString(36).substr(2, 9);
    const newReview: Review = {
      reviewId,
      productId,
      userId: user.uid,
      userName: userProfile?.displayName || user.displayName || 'Verified Reviewer',
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'reviews', reviewId), newReview);

      // Recalculate average rating of the product
      const productDocRef = doc(db, 'products', productId);
      const matchedReviews = reviews.filter(r => r.productId === productId);
      const totalRatingsCount = matchedReviews.length + 1;
      const totalRatingSum = matchedReviews.reduce((sum, r) => sum + r.rating, 0) + rating;
      const averageRating = Math.round((totalRatingSum / totalRatingsCount) * 10) / 10;

      await updateDoc(productDocRef, {
        ratings: averageRating,
        reviewsCount: totalRatingsCount,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `reviews/${reviewId}`);
    }
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter(r => r.productId === productId).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  };


  // --- ADMIN METHODS (Strictly gated, check if isAdmin is verified) ---

  const adminAddProduct = async (productData: Omit<Product, 'productId' | 'createdAt' | 'updatedAt' | 'ratings' | 'reviewsCount'>) => {
    if (!isAdmin) throw new Error('Forbidden: Admin resources only.');

    const productId = 'prod_' + Math.random().toString(36).substr(2, 9);
    const newProduct: Product = {
      ...productData,
      productId,
      ratings: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'products', productId), newProduct);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${productId}`);
    }
  };

  const adminEditProduct = async (productId: string, productData: Partial<Product>) => {
    if (!isAdmin) throw new Error('Forbidden: Admin resources only.');

    const ref = doc(db, 'products', productId);
    try {
      await updateDoc(ref, {
        ...productData,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${productId}`);
    }
  };

  const adminDeleteProduct = async (productId: string) => {
    if (!isAdmin) throw new Error('Forbidden: Admin resources only.');

    const ref = doc(db, 'products', productId);
    try {
      await deleteDoc(ref);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    }
  };

  const adminUpdateStockPrice = async (productId: string, price: number, salePrice: number | null, stock: number) => {
    if (!isAdmin) throw new Error('Forbidden: Admin resources only.');

    const ref = doc(db, 'products', productId);
    try {
      await updateDoc(ref, {
        price,
        salePrice: salePrice || null,
        stockQuantity: stock,
        status: stock === 0 ? 'out_of_stock' : 'active',
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${productId}`);
    }
  };

  const adminAddCategory = async (categoryData: Omit<Category, 'categoryId'>) => {
    if (!isAdmin) throw new Error('Forbidden: Admin resources only.');

    const categoryId = 'cat_' + Math.random().toString(36).substr(2, 9);
    const newCategory: Category = {
      ...categoryData,
      categoryId
    };

    try {
      await setDoc(doc(db, 'categories', categoryId), newCategory);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `categories/${categoryId}`);
    }
  };

  const adminDeleteCategory = async (categoryId: string) => {
    if (!isAdmin) throw new Error('Forbidden: Admin resources only.');

    const ref = doc(db, 'categories', categoryId);
    try {
      await deleteDoc(ref);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${categoryId}`);
    }
  };

  const adminUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!isAdmin) throw new Error('Forbidden: Admin resources only.');

    const order = orders.find(o => o.orderId === orderId);
    if (!order) throw new Error('Order not found');

    const ref = doc(db, 'orders', orderId);
    try {
      const batch = writeBatch(db);
      const updatePayload: any = {
        status,
        orderStatus: status, // synchronize both status and orderStatus
        updatedAt: new Date().toISOString()
      };
      if (status === 'cancelled') {
        updatePayload.cancelledBy = 'Admin';
      }
      batch.update(ref, updatePayload);

      // Revert/restore stocks if cancelled
      if (status === 'cancelled' && order.status !== 'cancelled') {
        const itemsToRestore = order.items || order.orderedProducts || [];
        for (const item of itemsToRestore) {
          const productRef = doc(db, 'products', item.productId);
          const currentProd = products.find(p => p.productId === item.productId);
          if (currentProd) {
            const currentStock = currentProd.stockQuantity || 0;
            const newStock = currentStock + item.quantity;
            batch.update(productRef, {
              stockQuantity: newStock,
              status: 'active',
              updatedAt: new Date().toISOString()
            });
          }
        }
      }

      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
    }
  };

  const customerUpdateOrderStatus = async (orderId: string, status: 'cancelled' | 'processing') => {
    if (!user) throw new Error('Authentication required');

    const order = orders.find(o => o.orderId === orderId);
    if (!order) throw new Error('Order not found');

    const ref = doc(db, 'orders', orderId);
    try {
      const batch = writeBatch(db);
      const updatePayload: any = {
        status,
        orderStatus: status, // synchronize both status and orderStatus
        updatedAt: new Date().toISOString()
      };
      if (status === 'cancelled') {
        updatePayload.cancelledBy = 'Customer';
      }
      batch.update(ref, updatePayload);

      // Revert/restore stocks if cancelled
      if (status === 'cancelled' && order.status !== 'cancelled') {
        const itemsToRestore = order.items || order.orderedProducts || [];
        for (const item of itemsToRestore) {
          const productRef = doc(db, 'products', item.productId);
          const currentProd = products.find(p => p.productId === item.productId);
          if (currentProd) {
            const currentStock = currentProd.stockQuantity || 0;
            const newStock = currentStock + item.quantity;
            batch.update(productRef, {
              stockQuantity: newStock,
              status: 'active',
              updatedAt: new Date().toISOString()
            });
          }
        }
      }

      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
    }
  };

  const adminDeleteOrder = async (orderId: string) => {
    if (!isAdmin) throw new Error('Forbidden: Admin resources only.');

    const ref = doc(db, 'orders', orderId);
    try {
      await deleteDoc(ref);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`);
    }
  };


  return (
    <AppContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        authLoading,
        loginWithGoogle,
        logout,
        registerWithEmail,
        loginWithEmail,
        resetPassword,

        saveAddress,
        removeAddress,
        toggleWishlist,

        products,
        categories,
        orders,
        reviews,
        storeLoading,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,

        placeOrder,
        submitReview,
        getProductReviews,

        adminAddProduct,
        adminEditProduct,
        adminDeleteProduct,
        adminUpdateStockPrice,
        adminAddCategory,
        adminDeleteCategory,
        adminUpdateOrderStatus,
        adminDeleteOrder,
        customerUpdateOrderStatus,
        allUsers
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
