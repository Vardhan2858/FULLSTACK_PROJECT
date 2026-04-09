// Mock Product Service with data
import vegetablesImg from '../assets/images/categories/vegetables.jpg';
import fruitsImg from '../assets/images/categories/fruits.jpg';
import farmerImg from '../assets/images/categories/Farmer.jpg';
import tomatoImg from '../assets/images/products/tomato.jpg';
import carrotImg from '../assets/images/products/carrot.jpg';
import spinachImg from '../assets/images/products/spinach.jpg';
import pepperImg from '../assets/images/products/pepper.jpg';
import appleImg from '../assets/images/products/apple.jpg';
import bananaImg from '../assets/images/products/banana.jpg';
import berriesImg from '../assets/images/products/berries.jpg';
import orangesImg from '../assets/images/products/oranges.jpg';
import riceImg from '../assets/images/products/rice.jpg';
import wheatImg from '../assets/images/products/wheat.jpg';
import lentilsImg from '../assets/images/products/lentils.jpg';
import oliveImg from '../assets/images/products/olive.jpg';

const imageMap = {
  'organic tomatoes': tomatoImg,
  tomatoes: tomatoImg,
  tomato: tomatoImg,
  'organic apples': appleImg,
  carrots: carrotImg,
  carrot: carrotImg,
  'spinach bundle': spinachImg,
  spinach: spinachImg,
  'bell peppers': pepperImg,
  pepper: pepperImg,
  peppers: pepperImg,
  'organic bananas': bananaImg,
  apples: appleImg,
  apple: appleImg,
  bananas: bananaImg,
  banana: bananaImg,
  'organic berries mix': berriesImg,
  berries: berriesImg,
  'organic oranges': orangesImg,
  oranges: orangesImg,
  orange: orangesImg,
  rice: riceImg,
  'organic rice': riceImg,
  'whole wheat flour': wheatImg,
  wheat: wheatImg,
  flour: wheatImg,
  'organic lentils': lentilsImg,
  lentils: lentilsImg,
  'olive oil': oliveImg,
};

const normalizeName = (value) => (value || '').toString().trim().toLowerCase();

const enrichProduct = (product) => {
  const normalizedName = normalizeName(product?.name);
  const normalizedCategory = normalizeName(product?.category);
  return {
    ...product,
    image: product?.image || imageMap[normalizedName] || imageMap[normalizedCategory] || '/vite.svg',
  };
};

const enrichProducts = (products) => (products || []).map(enrichProduct);
const LOCAL_ORDERS_KEY = 'orders';
const LOCAL_PRODUCTS_KEY = 'farmer_products';

const getLocalOrders = () => {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to parse local orders:', error);
    return [];
  }
};

const saveLocalOrders = (orders) => {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
};

const getLocalProducts = () => {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to parse local products:', error);
    return [];
  }
};

const saveLocalProducts = (products) => {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
};

const asNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const getNextProductId = (products = []) => {
  const maxId = products.reduce((max, product) => {
    const idNum = Number(product?.id);
    if (Number.isFinite(idNum) && idNum > max) {
      return idNum;
    }
    return max;
  }, 0);
  return maxId + 1;
};

export const mockProducts = [
  // Vegetables
  { id: 1, name: 'Organic Tomatoes', category: 'vegetables', price: 45, image: tomatoImg, description: 'Fresh organic tomatoes', stock: 50 },
  { id: 2, name: 'Carrots', category: 'vegetables', price: 35, image: carrotImg, description: 'Crunchy organic carrots', stock: 60 },
  { id: 3, name: 'Spinach Bundle', category: 'vegetables', price: 25, image: spinachImg, description: 'Fresh organic spinach', stock: 40 },
  { id: 4, name: 'Bell Peppers', category: 'vegetables', price: 70, image: pepperImg, description: 'Colorful organic peppers', stock: 35 },

  // Fruits
  { id: 5, name: 'Organic Apples', category: 'fruits', price: 110, image: appleImg, description: 'Sweet organic apples', stock: 80 },
  { id: 6, name: 'Bananas', category: 'fruits', price: 45, image: bananaImg, description: 'Fresh yellow bananas', stock: 100 },
  { id: 7, name: 'Organic Berries Mix', category: 'fruits', price: 180, image: berriesImg, description: 'Mixed organic berries', stock: 30 },
  { id: 8, name: 'Oranges', category: 'fruits', price: 70, image: orangesImg, description: 'Juicy organic oranges', stock: 70 },

  // Staples
  { id: 9, name: 'Organic Rice', category: 'staples', price: 90, image: riceImg, description: '1kg organic rice sack', stock: 120 },
  { id: 10, name: 'Whole Wheat Flour', category: 'staples', price: 55, image: wheatImg, description: '1kg organic flour', stock: 90 },
  { id: 11, name: 'Organic Lentils', category: 'staples', price: 70, image: lentilsImg, description: '500g organic lentils', stock: 60 },
  { id: 12, name: 'Olive Oil', category: 'staples', price: 320, image: oliveImg, description: '500ml extra virgin olive oil', stock: 45 },
];

export const mockCategories = [
  { id: 1, name: 'Vegetables', slug: 'vegetables', image: vegetablesImg },
  { id: 2, name: 'Fruits', slug: 'fruits', image: fruitsImg },
  { id: 3, name: 'Staples', slug: 'staples', image: farmerImg },
];

export const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@organic.com', role: 'admin', joinDate: '2025-01-01' },
  { id: 2, name: 'John Farmer', email: 'farmer@organic.com', role: 'farmer', joinDate: '2025-02-01' },
  { id: 3, name: 'Jane Customer', email: 'customer1@organic.com', role: 'customer', joinDate: '2025-02-15' },
];

export const mockOrders = [
  { id: 1, userId: 3, products: [{ id: 1, quantity: 2 }], total: 90, date: '2025-02-15', status: 'completed' },
  { id: 2, userId: 3, products: [{ id: 5, quantity: 1 }, { id: 6, quantity: 2 }], total: 200, date: '2025-02-18', status: 'pending' },
  { id: 3, userId: 3, products: [{ id: 9, quantity: 1 }], total: 90, date: '2025-02-20', status: 'completed' },
];

// Mock Product Service with data
import { productAPI, userAPI } from './api';

export const productService = {
  getUsers: async () => {
    try {
      return await userAPI.getUsers();
    } catch (error) {
      console.warn('Fetch users API failed, using mock:', error);
      return mockUsers;
    }
  },

  deleteUser: async (id) => {
    try {
      await userAPI.deleteUser(id);
      return true;
    } catch (error) {
      console.warn('Delete user API failed:', error);
      return false;
    }
  },

  getAllProducts: async () => {
    const localProducts = enrichProducts(getLocalProducts());
    try {
      const products = await productAPI.getAllProducts();
      const apiProducts = Array.isArray(products) ? enrichProducts(products) : [];
      const localIds = new Set(localProducts.map((product) => Number(product.id)));

      const merged = [
        ...localProducts,
        ...apiProducts.filter((product) => !localIds.has(Number(product.id))),
      ];

      return merged.length > 0 ? merged : mockProducts;
    } catch (error) {
      console.warn('Fetch products API failed, using mock:', error);
      return localProducts.length > 0 ? [...localProducts, ...mockProducts] : mockProducts;
    }
  },

  getProductById: async (id) => {
    const localProduct = getLocalProducts().find((product) => Number(product.id) === Number(id));
    if (localProduct) {
      return enrichProduct(localProduct);
    }

    try {
      // Assuming backend has /products/{id}
      const response = await fetch(`http://localhost:8080/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const product = await response.json();
      return enrichProduct(product);
    } catch (error) {
      console.warn('Fetch product API failed, using mock:', error);
      return enrichProduct(mockProducts.find(p => p.id === parseInt(id)));
    }
  },

  getProductsByCategory: async (category) => {
    const localProducts = enrichProducts(
      getLocalProducts().filter((product) => normalizeName(product.category) === normalizeName(category))
    );

    try {
      const products = await productAPI.getProductsByCategory(category);
      const apiProducts = Array.isArray(products) ? enrichProducts(products) : [];
      const localIds = new Set(localProducts.map((product) => Number(product.id)));
      const merged = [
        ...localProducts,
        ...apiProducts.filter((product) => !localIds.has(Number(product.id))),
      ];

      return merged.length > 0
        ? merged
        : enrichProducts(mockProducts.filter(p => p.category === category));
    } catch (error) {
      console.warn('Fetch products by category API failed, using mock:', error);
      return localProducts.length > 0
        ? localProducts
        : enrichProducts(mockProducts.filter(p => p.category === category));
    }
  },

  getCategories: async () => {
    try {
      // Assuming backend has /categories
      const res = await fetch('http://localhost:8080/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const categories = await res.json();
      return Array.isArray(categories) && categories.length > 0 ? categories : mockCategories;
    } catch (error) {
      console.warn('Fetch categories API failed, using mock:', error);
      return mockCategories;
    }
  },

  addProduct: async (product) => {
    const localProducts = getLocalProducts();
    const mergedForId = [...localProducts, ...mockProducts];

    const localPayload = {
      id: getNextProductId(mergedForId),
      name: product.name,
      category: product.category,
      description: product.description,
      price: asNumber(product.price),
      stock: asNumber(product.stock),
      image: product.image || '/vite.svg',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: localPayload.name,
          category: localPayload.category,
          description: localPayload.description,
          price: localPayload.price,
        })
      });
      if (!res.ok) throw new Error('Failed to add product');
      const created = await res.json();

      const productWithServerId = {
        ...localPayload,
        id: Number(created?.id) || localPayload.id,
      };

      const updatedProducts = [productWithServerId, ...localProducts];
      saveLocalProducts(updatedProducts);
      return enrichProduct(productWithServerId);
    } catch (error) {
      console.warn('Add product API failed, using mock:', error);
      const updatedProducts = [localPayload, ...localProducts];
      saveLocalProducts(updatedProducts);
      return enrichProduct(localPayload);
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update product');
      return res.json();
    } catch (error) {
      console.warn('Update product API failed, using mock:', error);
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...updates };
        return mockProducts[index];
      }
      return null;
    }
  },

  deleteProduct: async (id) => {
    const localProducts = getLocalProducts();
    const updatedLocalProducts = localProducts.filter((product) => Number(product.id) !== Number(id));
    saveLocalProducts(updatedLocalProducts);

    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        // Fallback to mock
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
          mockProducts.splice(index, 1);
          return true;
        }
        throw new Error('Failed to delete product');
      }
      return true;
    } catch (error) {
      console.warn('Delete product API failed, using mock:', error);
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
        return true;
      }
      return false;
    }
  },

  placeOrder: async (orderData) => {
    const payload = {
      userId: orderData.userId,
      customerName: orderData.customerName || '',
      products: orderData.products || [],
      total: Number(orderData.total) || 0,
      date: orderData.date || new Date().toISOString(),
      status: orderData.status || 'pending',
    };

    const localOrders = getLocalOrders();
    const nextId = localOrders.length > 0
      ? Math.max(...localOrders.map((o) => Number(o.id) || 0)) + 1
      : 1;

    const localOrder = {
      id: nextId,
      ...payload,
    };

    saveLocalOrders([localOrder, ...localOrders]);
    return localOrder;
  },

  updateOrderStatus: async (orderData, newStatus, metadata = {}) => {
    const orderId = typeof orderData === 'object' ? orderData?.id : orderData;
    const now = new Date().toISOString();
    const localOrders = getLocalOrders();
    const updatedLocalOrders = localOrders.map((order) =>
      Number(order.id) === Number(orderId)
        ? {
            ...order,
            status: newStatus,
            completedById: newStatus === 'completed' ? metadata.completedById ?? order.completedById : order.completedById,
            completedByName: newStatus === 'completed' ? metadata.completedByName ?? order.completedByName : order.completedByName,
            completedAt: newStatus === 'completed' ? now : order.completedAt,
          }
        : order
    );

    const existsInLocal = updatedLocalOrders.some((order) => Number(order.id) === Number(orderId));
    const orderSeed = typeof orderData === 'object' ? orderData : null;
    const finalLocalOrders = existsInLocal
      ? updatedLocalOrders
      : [
          {
            ...(orderSeed || {}),
            id: orderId,
            status: newStatus,
            completedById: newStatus === 'completed' ? metadata.completedById : undefined,
            completedByName: newStatus === 'completed' ? metadata.completedByName : undefined,
            completedAt: newStatus === 'completed' ? now : undefined,
          },
          ...updatedLocalOrders,
        ];

    saveLocalOrders(finalLocalOrders);

    return finalLocalOrders.find((order) => Number(order.id) === Number(orderId)) || null;
  },

  getOrders: async (userId) => {
    const localOrders = getLocalOrders();
    const localFiltered = userId
      ? localOrders.filter((o) => Number(o.userId) === Number(userId))
      : localOrders;

    if (localFiltered.length > 0) {
      return localFiltered;
    }
    if (userId) {
      return mockOrders.filter(o => o.userId === userId);
    }
    return mockOrders;
  },
};
