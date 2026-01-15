import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderComponent from '../../../Components/AdminComponent/HeaderComponent';
import productIcon from '../../../Images/Icon/productIcon.png';
import LoadingComponent from '../../../Components/LoadingComponent/LoadingComponent';
import './ProductPage.css';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL;

  // Simplified useEffect for fetching products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_URL}/api/products/getproducts`);
        
        if (response.data) {
          let productsData = response.data;
          
          // Handle different response formats
          if (response.data.data) {
            productsData = response.data.data;
          } else if (response.data.products) {
            productsData = response.data.products;
          }
          
          // Ensure productsData is an array
          if (!Array.isArray(productsData)) {
            productsData = [productsData];
          }
          
          // Transform products to consistent format
          const transformedProducts = productsData.map(product => ({
            id: product._id || product.id || `temp-${Date.now()}`,
            productId: product.productId || product.productCode || 'MED-000',
            name: product.name || product.productName || 'Unknown Product',
            altNames: product.altNames || product.alternateNames || [],
            description: product.description || '',
            images: product.images || product.imageUrls || [],
            labeledPrice: product.labeledPrice || product.mrp || product.originalPrice || 0,
            price: product.price || product.sellingPrice || product.discountedPrice || 0,
            stock: product.stock || product.quantity || product.inventory || 0,
            isAvailable: product.isAvailable !== undefined ? product.isAvailable : (product.stock || 0) > 0
          }));
          
          setProducts(transformedProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        
        let errorMessage = 'Failed to fetch products. Please try again.';
        if (err.response?.status === 404) {
          errorMessage = 'API endpoint not found. Please check the server.';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message.includes('timeout')) {
          errorMessage = 'Request timeout. Please check your connection.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  const handleView = (id) => {
    console.log(`View product ${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/api/products/${id}`);
        setProducts(products.filter(product => product.id !== id));
        alert('Product deleted successfully!');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleAddProduct = () => {
    console.log('Add new product');
  };

  const handleToggleAvailability = async (id) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;
      
      const updatedAvailability = !product.isAvailable;
      
      await axios.put(`${API_URL}/api/products/${id}`, {
        isAvailable: updatedAvailability
      });
      
      setProducts(products.map(product => 
        product.id === id 
          ? { ...product, isAvailable: updatedAvailability }
          : product
      ));
      
      alert(`Product ${updatedAvailability ? 'made available' : 'marked as out of stock'}!`);
    } catch (err) {
      console.error('Error toggling availability:', err);
      alert('Failed to update product availability. Please try again.');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg text-white flex flex-col p-4 m-4 rounded-lg product-section">
          <LoadingComponent timeout={3000} />
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div>
        <HeaderComponent
          title="Product Management"
          description="Track product performance, availability, and operational metrics in real time."
          icon={productIcon}
        />
        <div className="bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg text-white flex flex-col p-4 m-4 rounded-lg product-section">
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-red-300">
              <p className="text-xl font-semibold mb-4">{error}</p>
              <p className="text-sm mb-6 text-gray-300">
                Unable to connect to server at: {API_URL}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-white bg-gradient-to-r from-[#004B9C] to-[#0578F4] hover:from-[#0578F4] hover:to-[#004B9C] px-4 py-2 rounded-md transition-all duration-200 shadow-md border border-white/80"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <HeaderComponent
          title="Product Management"
          description="Track product performance, availability, and operational metrics in real time."
          icon={productIcon}
        />
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg text-white flex flex-col p-4 m-4 rounded-lg product-section">
        <div className="flex flex-wrap -mx-3 text-white">
          <div className="w-full max-w-full px-3 mx-auto">
            <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white/10 text-white m-5">
              <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30 text-white">

                <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
                  <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-white">
                    <span className="mr-3 font-semibold text-white">Product Catalog</span>
                    <span className="mt-1 font-medium text-white text-lg/normal">
                    Browse and manage your complete product listings
                    </span>
                  </h3>
                  <div className="flex items-center">
                    <button 
                      onClick={handleAddProduct}
                      className="text-white bg-gradient-to-r from-[#126E00] to-[#02C709] hover:from-[#02C709] hover:to-[#126E00] font-medium px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md border border-green-900/80"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      Add Product
                    </button>
                  </div>
                </div>

                <div className="flex-auto block py-8 pt-6 px-9">
                  {error && (
                    <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                      <p className="text-yellow-300 text-sm">
                        <span className="font-semibold">Note:</span> {error}
                      </p>
                    </div>
                  )}
                  
                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-300 mb-4">
                        <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
                      <p className="text-gray-300 mb-6">There are no products in the database.</p>
                      <button 
                        onClick={handleAddProduct}
                        className="text-white bg-gradient-to-r from-[#126E00] to-[#02C709] hover:from-[#02C709] hover:to-[#126E00] font-medium px-6 py-3 rounded-md transition-all duration-200 flex items-center gap-2 shadow-md border border-green-900/80 mx-auto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Add Your First Product
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-white/50 rounded-lg shadow-lg">
                      <table className="w-full text-white border-collapse">
                        <thead>
                          <tr className="font-semibold text-[0.95rem] text-white bg-gradient-to-r from-blue-600 to-blue-300">
                            <th className="p-4 text-center border-r border-white/30">Product ID</th>
                            <th className="p-4 text-center border-r border-white/30">Product Name</th>
                            <th className="p-4 text-center border-r border-white/30 w-32">Labeled Price</th>
                            <th className="p-4 text-center border-r border-white/30 w-32">Selling Price</th>
                            <th className="p-4 text-center border-r border-white/30 w-32">Stock</th>
                            <th className="p-4 text-center border-r border-white/30">Status</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product, index) => (
                            <tr 
                              key={product.id}
                              className={`bg-gradient-to-r from-blue-200 to-blue-100 hover:from-blue-200 hover:to-blue-200 transition-all duration-200 ${
                                index < products.length - 1 ? 'border-b border-gray-300' : ''
                              }`}
                            >
                              <td className="p-3 text-center border-r border-gray-300">
                                <div className="flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold mr-3 shadow-lg">
                                    {product.productId ? product.productId.substring(0, 2) : 'PR'}
                                  </div>
                                  <span className="font-medium text-black">{product.productId}</span>
                                </div>
                              </td>
                              <td className="p-3 border-r border-gray-300">
                                <div>
                                  <span className="font-medium text-black">{product.name}</span>
                                </div>
                              </td>
                              <td className="p-3 text-center border-r border-gray-300">
                                <span className="font-medium text-black line-through">
                                  ${typeof product.labeledPrice === 'number' ? product.labeledPrice.toFixed(2) : '0.00'}
                                </span>
                              </td>
                              <td className="p-3 text-center border-r border-gray-300">
                                <span className="font-bold text-green-700">
                                  ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                                </span>
                              </td>
                              <td className="p-3 text-center border-r border-gray-300 ">
                                <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 100 ? 'text-orange-600' : 'text-green-700'}`}>
                                  {product.stock} units
                                </span>
                              </td>
                              <td className="p-3 text-center border-r border-gray-300">
                                <button
                                  onClick={() => handleToggleAvailability(product.id)}
                                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 shadow-md cursor-pointer ${
                                    product.isAvailable 
                                      ? 'bg-gradient-to-r from-green-500 to-green-300 border border-green-300 text-white'
                                      : 'bg-gradient-to-r from-red-500 to-orange-300 border border-red-300 text-white'
                                  }`}
                                >
                                  {product.isAvailable ? 'Available' : 'Out of Stock'}
                                </button>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex space-x-2 justify-center">
                                  <button 
                                    onClick={() => handleView(product.id)}
                                    className="text-white bg-gradient-to-r from-[#004B9C] to-[#0578F4] hover:from-[#0578F4] hover:to-[#004B9C] px-3 py-1 rounded-md transition-all duration-200 shadow-md border border-white/80"
                                  >
                                    View
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(product.id)}
                                    className="text-white bg-gradient-to-r from-[#9C0000] to-[#F40505] hover:from-[#F40505] hover:to-[#9C0000] px-3 py-1 rounded-md transition-all duration-200 shadow-md border border-white/80"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;