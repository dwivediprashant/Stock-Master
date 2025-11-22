import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  getProducts,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
  getProductCategories,
  getProductUnits,
} from "../features/products/api";

const ProductContext = createContext();

types = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_CATEGORIES: "SET_CATEGORIES",
  SET_UNITS: "SET_UNITS",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
};

const initialState = {
  products: [],
  categories: [],
  units: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

function productReducer(state, action) {
  switch (action.type) {
    case types.SET_LOADING:
      return { ...state, loading: action.payload };
    case types.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case types.SET_PRODUCTS:
      return { ...state, products: action.payload, loading: false };
    case types.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case types.SET_UNITS:
      return { ...state, units: action.payload };
    case types.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 },
      };
    case types.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };
    default:
      return state;
  }
}

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = async () => {
    try {
      dispatch({ type: types.SET_LOADING, payload: true });
      const { products, pagination } = await getProducts({
        page: state.pagination.page,
        limit: state.pagination.limit,
        ...state.filters,
      });
      dispatch({ type: types.SET_PRODUCTS, payload: products });
      dispatch({ type: types.SET_PAGINATION, payload: pagination });
    } catch (error) {
      dispatch({ type: types.SET_ERROR, payload: error.message });
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = await getProductCategories();
      dispatch({ type: types.SET_CATEGORIES, payload: categories });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchUnits = async () => {
    try {
      const units = await getProductUnits();
      dispatch({ type: types.SET_UNITS, payload: units });
    } catch (error) {
      console.error("Failed to fetch units:", error);
    }
  };

  const createProduct = async (productData) => {
    try {
      dispatch({ type: types.SET_LOADING, payload: true });
      await createProductApi(productData);
      await fetchProducts();
      return { success: true };
    } catch (error) {
      dispatch({ type: types.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      dispatch({ type: types.SET_LOADING, payload: true });
      await updateProductApi(id, productData);
      await fetchProducts();
      return { success: true };
    } catch (error) {
      dispatch({ type: types.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      dispatch({ type: types.SET_LOADING, payload: true });
      await deleteProductApi(id);
      await fetchProducts();
      return { success: true };
    } catch (error) {
      dispatch({ type: types.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: types.SET_FILTERS, payload: filters });
  };

  const setPage = (page) => {
    dispatch({ type: types.SET_PAGINATION, payload: { page } });
  };

  useEffect(() => {
    fetchProducts();
  }, [state.filters, state.pagination.page]);

  useEffect(() => {
    fetchCategories();
    fetchUnits();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        ...state,
        createProduct,
        updateProduct,
        deleteProduct,
        setFilters,
        setPage,
        refetchProducts: fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
