import React, { useState, useEffect, useRef } from "react";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import "../styles/shop.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.config";
import ProductsList from "../components/UI/ProductsList";
import Clock from "../components/UI/Clock";
import { Link } from "react-router-dom";
import timer from "../assets/images/timer.png";
import { motion } from "framer-motion";

const Shop = () => {
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const readCountRef = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      readCountRef.current += 1;
      console.log("Number of Firestore reads:", readCountRef.current);

      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductsData(products);
      setFilteredProducts(products);
      setSearchTerm("");
      setIsLoading(false);

      // Show "No Products Found" after 10 seconds
      setTimeout(() => {
        setIsLoading(true);
      }, 10000);
    } catch (error) {
      console.log("Error fetching products: ", error);
    }
  };

  const handleFilter = (e) => {
    const filterValue = e.target.value;
    setSelectedCategory(filterValue);
    setSelectedSubCategory(""); // Reset the sub-category when the category changes
    applyFilters(filterValue, selectedSubCategory, selectedSort, searchTerm);
  };

  const handleSubCategory = (e) => {
    const subCategoryValue = e.target.value;
    setSelectedSubCategory(subCategoryValue);
    applyFilters(selectedCategory, subCategoryValue, selectedSort, searchTerm);
  };

  const handleSort = (e) => {
    const sortValue = e.target.value;
    setSelectedSort(sortValue);
    applyFilters(selectedCategory, selectedSubCategory, sortValue, searchTerm);
  };

  const applyFilters = (category, subCategory, sort, term) => {
    let filteredProducts = productsData;

    if (category !== "") {
      filteredProducts = productsData.filter((item) => item.category === category);
    }

    if (subCategory !== "") {
      filteredProducts = filteredProducts.filter((item) => item.subCategory === subCategory);
    }

    if (sort === "price-low-high") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high-low") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    if (term !== "") {
      const searchTermLower = term.toLowerCase();
      filteredProducts = filteredProducts.filter((item) => {
        const titleLower = item.title.toLowerCase();
        const categoryLower = item.category.toLowerCase();
        const subCategoryLower = item.subCategory.toLowerCase();

        return (
          titleLower.includes(searchTermLower) ||
          categoryLower.includes(searchTermLower) ||
          subCategoryLower.includes(searchTermLower)
        );
      });
    }

    setFilteredProducts(filteredProducts);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedSort("");
    setFilteredProducts(productsData);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    applyFilters(selectedCategory, selectedSubCategory, selectedSort, searchTerm);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const subCategoryOptions = {
    Saree: ['Cotton', 'Georgette', 'Banarasi', 'Organza', 'Chiffon', 'Silk', 'Ready to wear','Net','Rayon','Silk'],
    'Unstitched Dress Material': ['Pure Cotton', 'Pure Lawn', 'Georgette', 'Organza', 'Silk','Net','Rayon','Silk'],
    'Stitched Dress': ['Cotton', 'Georgette', 'Organza','Net','Rayon','Silk'],
    'Readymade kurti': ['Straight Shirt', 'Anarkali','Rayon','Silk'],
    Gowns: ['Semi-stitched', 'Ready-made','Net','Rayon','Silk'],
    Sharara: ['Semi-stitched', 'Ready-made','Net','Rayon','Silk'],
    Lehangas: ['Bridemaid', 'Bridal','Net','Rayon','Silk'],
  };


  

  return (
    <Helmet title="Shop">
      <CommonSection title="Products" hideOnMobile={true}/>

      <section className="stick-section">
        <Container>
          <Row>
          <Col lg="12" >
            <div className="search_box_cont" ><div className="search__box">
                <input
                  type="text"
                  placeholder="Search Product ..."
                  onChange={handleSearch}
                  value={searchTerm}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div></div>
              
            </Col>

            <div>

           <div className="widgets"></div>

            <div className="filter__widget">
                <select value={selectedCategory} onChange={handleFilter}>
                  <option value="">Filter By Category</option>
                  <option value="Saree">Saree</option>
                  <option value="Unstitched Dress Material">Unstitched Dress Material</option>
                  <option value="Stitched Dress">Stitched Dress</option>
                  <option value="Readymade kurti">Readymade Kurti</option>
                  <option value="Gowns">Gown</option>
                  <option value="Sharara">Sharara</option>
                  <option value="Lehangas">Lehangas</option>
                </select>
              </div>
            
              {selectedCategory && (
                <div className="filter__widget">
                  <select value={selectedSubCategory} onChange={handleSubCategory}>
                    <option value="">Filter By Sub-Category</option>
                    {subCategoryOptions[selectedCategory]?.map((subCategory) => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            
              <div className="filter__widget">
                <select value={selectedSort} onChange={handleSort}>
                  <option value="">Sort by</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>
   
           
            
              {(selectedCategory !== "" || selectedSubCategory !== "" || selectedSort !== "") && (
                <button className="buy__button" onClick={handleClearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
            
              

          </Row>
        </Container>
      
        <Container>
          <Row>
            {currentProducts.length === 0 ? (
              <h1 className="text-center fs-4">No Products Found</h1>
            ) : (
              <>
                <ProductsList data={currentProducts} />
                <Pagination
                  productsPerPage={productsPerPage}
                  totalProducts={filteredProducts.length}
                  currentPage={currentPage}
                  paginate={paginate}
                />
              </>
            )}
          </Row>
        </Container>
      </section>

      


    </Helmet>
  );
};

const Pagination = ({ productsPerPage, totalProducts, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="pagination">
      {pageNumbers.map((number) => (
        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
          <button className="page-link" onClick={() => paginate(number)}>
            {number}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Shop;
