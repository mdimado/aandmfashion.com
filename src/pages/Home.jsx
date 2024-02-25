import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Helmet from "../components/Helmet/Helmet";
import "../styles/home.css";
import { Container, Row, Col } from "reactstrap";
import Services from "../services/Services";
import ProductsList from "../components/UI/ProductsList";
import Clock from "../components/UI/Clock";
import useGetData from "../custom-hooks/useGetData";
import timer from "../assets/images/timer.png";


const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const limit = 10; // Set the number of documents to fetch at once
  const { data: products, loading } = useGetData("products", limit);

  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSalesProducts, setBestSalesProducts] = useState([]);
  const year = new Date().getFullYear();

  useEffect(() => {
    if (products && products.length > 0) {
      setTrendingAndBestSalesProducts(products);
    }
  }, [products]);

  const setTrendingAndBestSalesProducts = (products) => {
    const filteredTrendingProducts = products.filter(
      (item) => item.Trending === "Yes"
    );

    const filteredBestSalesProducts = products.filter(
      (item) => item.New === "Yes"
    );

    setTrendingProducts(filteredTrendingProducts);
    setBestSalesProducts(filteredBestSalesProducts);
  };

  const limitProducts = 12;

  const renderTrendingProducts = useMemo(() => {
    return loading ? (
      <h5 className="fw-bold">Loading...</h5>
    ) : (
      <ProductsList data={trendingProducts.slice(0, limitProducts)} />
    );
  }, [loading, trendingProducts]);

  const renderBestSalesProducts = useMemo(() => {
    return loading ? (
      <h5 className="fw-bold">Loading...</h5>
    ) : (
      <ProductsList data={bestSalesProducts.slice(0, limitProducts)} />
    );
  }, [loading, bestSalesProducts]);


  return (
    <Helmet title={"Home"}>
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero_content">
                <p className="hero_subtitle">Trending Designs of {year}</p>
                <div className="h21">
                  <h2>Unleash your Style</h2>
                </div>
                <div className="h22 mt-0">
                  <h2 className="colchange">with a&m</h2>
                </div>

                <h1 className="tal">
                  Discover your signature style and make a lasting impression
                  with A&M's curated collection of fashion-forward essentials.
                </h1>

                <motion.button
                  whileHover={{ scale: 1.2 }}
                  className="buy__button"
                >
                  <Link to="/shop">Shop Now</Link>
                </motion.button>
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="hero__img">
                <img src="https://firebasestorage.googleapis.com/v0/b/am-fashion-23ea1.appspot.com/o/hero-img.png?alt=media&token=9ff35257-9524-49d0-9ab7-1285b34e9030" alt="" />
              </div>
            </Col>
          </Row>
        </Container>

        

      </section>
      <Services />
      <section className="colourit">
      <Container >
      <Col lg="12" className="text-center">
              <h2 className="section__title coltex">Shop by Category</h2>
            </Col>
          
          
            <div className="feature-container">
      <Link to={"/unstitched"} className="feature-link">
        <div className="fe-box">
          <img src="https://firebasestorage.googleapis.com/v0/b/am-fashion-23ea1.appspot.com/o/category_images%2Fc-unstitched.png?alt=media&token=c5e1ef20-f126-4dd2-816e-04145c514a04" alt="" />
          <h6>Unstitched</h6>
        </div>
      </Link>
      <Link to={"/stitched"} className="feature-link">
        <div className="fe-box">
          <img src="https://firebasestorage.googleapis.com/v0/b/am-fashion-23ea1.appspot.com/o/category_images%2Fc-readymade.png?alt=media&token=4c5a05f3-2e0e-4c77-99f4-8dce00cb6fd6" alt="" />
          <h6>Ready Made</h6>
        </div>
      </Link>
      <Link to={"/saree"} className="feature-link">
        <div className="fe-box">
          <img src="https://firebasestorage.googleapis.com/v0/b/am-fashion-23ea1.appspot.com/o/category_images%2Fc-saree.png?alt=media&token=5f6c8edd-0a40-4f51-8118-9650b0416d9a" alt="" />
          <h6>Saree</h6>
        </div>
      </Link>
      <Link to={"/gown"} className="feature-link">
        <div className="fe-box">
          <img src="https://firebasestorage.googleapis.com/v0/b/am-fashion-23ea1.appspot.com/o/category_images%2Fc-gown.png?alt=media&token=f2ae9bc7-e9e6-4705-b23c-0fbe83543229" alt="" />
          <h6>Gowns</h6>
        </div>
      </Link>
      <Link to={"/sharara"} className="feature-link">
        <div className="fe-box">
          <img src="https://firebasestorage.googleapis.com/v0/b/am-fashion-23ea1.appspot.com/o/category_images%2Fc-sharara.png?alt=media&token=971dc94f-3ef9-4898-8fa5-b9bfb220ea31" alt="" />
          <h6>Sharara</h6>
        </div>
      </Link>
      <Link to={"/lehanga"} className="feature-link">
        <div className="fe-box">
          <img src="https://firebasestorage.googleapis.com/v0/b/am-fashion-23ea1.appspot.com/o/category_images%2Fc-lehanga.png?alt=media&token=cfbda8cd-68c0-43bf-8b3e-de527f3f9d0c" alt="" />
          <h6>Lehanga</h6>
        </div>
      </Link>
    </div>
          
        </Container>
        </section>
      
      <section className="trending__products">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Trending Products</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold"><div className="displayflexxing"> 
                
                <div class="card">
              <div class="card__image"></div>
              <div class="card__content">
                <h2 className="card__h2"></h2>
                <p className="card__p"></p>
              </div>
          </div>
          
          <div class="card">
              <div class="card__image"></div>
              <div class="card__content">
                <h2 className="card__h2"></h2>
                <p className="card__p"></p>
              </div>
          </div>
          
          <div class="card">
              <div class="card__image"></div>
              <div class="card__content">
                <h2 className="card__h2"></h2>
                <p className="card__p"></p>
              </div>
          </div>
          
          <div class="card">
              <div class="card__image"></div>
              <div class="card__content">
                <h2 className="card__h2"></h2>
                <p className="card__p"></p>
              </div>
          </div></div></h5>
            ) : (
              <ProductsList data={trendingProducts} />
              
            )}
          </Row>
        </Container>
       
      </section>

      <section className="timer__count">
        <Container>
          <Row>
            <div className="timer-div"><Col lg="6" md="12" className="count__down-col">
              <div className="clock_top-content">
                <h3 className="text-black fs-6 mb-2">Limited Offer</h3>
                <h3 className="text-black fs-3 mb-2 per">
                  50% off on all products
                </h3>
              </div>
              <Clock />

              <motion.button
                whileTap={{ scale: 1.2 }}
                className="buy__button store__btn mt-5"
              >
                <Link to="/shop">Visit Store</Link>
              </motion.button>
            </Col>
            
            <Col lg="6" md="12" className="text-end counter__img">
              <img src={timer} alt="" />
            </Col></div>
            
          </Row>
        </Container>
      </section>

      <section className="best__sales">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">New Arrivals</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading...</h5>
            ) : (
              <ProductsList data={bestSalesProducts} />
            )}
          </Row>
        </Container>
      </section>
      
    </Helmet>
  );
};

export default Home;
