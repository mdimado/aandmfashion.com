import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { favActions } from "../redux/slices/favSlice";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { db } from "../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import ProductsList from "../components/UI/ProductsList";
import "../styles/product-details.css";
import useGetData from "../custom-hooks/useGetData";
import dellog from '../assets/images/dellog.png';
import { NavLink, useNavigate } from "react-router-dom";



const ProductDetails = () => {

  
  useEffect(() => {
    
    window.scrollTo(0, 0);
  }, []);
  const limit = 10;
  const { data: products, loading } = useGetData("products", limit);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSalesProducts, setBestSalesProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [tab, setTab] = useState("desc");
  const reviewUser = useRef("");
  const reviewMsg = useRef("");
  const dispatch = useDispatch();
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedVariantImage, setSelectedVariantImage] = useState("");
  const [selectedDotIndex, setSelectedDotIndex] = useState(0);

  const handleDotClick = (index) => {
    setSelectedImageIndex(index);
    setSelectedDotIndex(index);
  };

  const renderDots = () => {
    if (!imgUrls) {
      return null; // or any fallback content you want to provide
    }
  
    return imgUrls.map((url, index) => (
      <div
        key={index}
        className={`dot ${selectedDotIndex === index ? "active" : ""}`}
        onClick={() => handleDotClick(index)}
      />
    ));
  };
  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log("No product found");
      }
    };

    fetchProduct();
  }, [id]);

  const {
    imgUrls,
    imgUrl,
    title,
    price,
    description,
    shortDesc,
    category,
    availableSizes,
    availableColors,
    vimgurls,
  } = product;

  useEffect(() => {
    const filteredTrendingProducts = products.filter(
      (item) => item.Trending === "Yes"
    );

    const filteredBestSalesProducts = products.filter(
      (item) => item.category === product.category
    );

    setTrendingProducts(filteredTrendingProducts);
    setBestSalesProducts(filteredBestSalesProducts);
  }, [products, product]);

  const submitHandler = (e) => {
    e.preventDefault();

    const reviewUserName = reviewUser.current.value;
    const reviewUserMsg = reviewMsg.current.value;

    const reviewObj = {
      userName: reviewUserName,
      text: reviewUserMsg,
    };

    console.log(reviewObj);
    toast.success("Review Submitted");
  };

  const addToCart = () => {
    if (availableSizes && availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select the size before adding to cart.");
      // Get the DOM element of the size__buttons section
    const sizeButtonsSection = document.querySelector(".size__buttons");

    if (sizeButtonsSection) {
      // Calculate the offset to scroll to the center of the page
      const windowHeight = window.innerHeight;
      const sizeButtonsSectionHeight = sizeButtonsSection.clientHeight;
      const offset = sizeButtonsSection.offsetTop - (windowHeight - sizeButtonsSectionHeight) / 2;

      // Scroll to the center of the page
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
      return;
    }

    if (availableColors && availableColors.length > 0 && !selectedColor) {
      toast.error("Please select the color before adding to cart.");
      // Get the DOM element of the size__buttons section
    const sizeButtonsSection = document.querySelector(".color__buttons");

    if (sizeButtonsSection) {
      // Calculate the offset to scroll to the center of the page
      const windowHeight = window.innerHeight;
      const sizeButtonsSectionHeight = sizeButtonsSection.clientHeight;
      const offset = sizeButtonsSection.offsetTop - (windowHeight - sizeButtonsSectionHeight) / 2;

      // Scroll to the center of the page
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
      
      return;
    }

    const newItem = {
      id,
      image: selectedVariantImage || imgUrl,
      title,
      price,
      quantity: 1,
      size: selectedSize,
      color: selectedColor,
    };

    dispatch(cartActions.addItem(newItem));

    
    toast.success(
      <div className="display-flex flex-direction-column">
        Product added successfully
        
        <button className="go-to-cart-button buy__button" onClick={() => navigateToCart()}>
          Go to Cart
        </button>
      </div>,
      {
        autoClose: 7000,
      }
    );
  };

  const addToFavorites = () => {
    dispatch(
      favActions.addItem({
        id,
        title,
        price,
        imgUrl,
      })
    );
    toast.success("Product added successfully");
    
  };

  // Function to handle "Go to Cart" button click
  const navigateToCart = () => {
    navigate('/cart');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  const sliderSettings = {
    dots: false, // Disable the default slick dots
    infinite: true,
    speed: 50,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: selectedImageIndex,
    prevArrow: <div className="custom-slider-arrow prev-arrow">Previous</div>,
    nextArrow: <div className="custom-slider-arrow next-arrow">Next</div>,
    autoplay: true,
    autoplaySpeed: 30000,
    arrows: true,
    beforeChange: (current, next) => setSelectedDotIndex(next),
  };

  // Function to handle size selection
  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const handleVariantSelection = (index) => {
    setSelectedVariantIndex(index);
    setSelectedVariantImage(vimgurls[index]); // Set the selected variant image URL
  };

  useEffect(() => {
    const updateMetaTags = () => {
      const ogImage = imgUrl;
      const ogTitle = title;
  
      const metaTags = document.head.getElementsByTagName("meta");
  
      // Remove existing Open Graph meta tags
      for (let i = metaTags.length - 1; i >= 0; i--) {
        const tag = metaTags[i];
        if (
          tag.getAttribute("property") === "og:image" ||
          tag.getAttribute("property") === "og:title"
        ) {
          tag.remove();
        }
      }
  
      // Add new Open Graph meta tags
      const ogImageTag = document.createElement("meta");
      ogImageTag.setAttribute("property", "og:image");
      ogImageTag.content = ogImage;
      document.head.appendChild(ogImageTag);
  
      const ogTitleTag = document.createElement("meta");
      ogTitleTag.setAttribute("property", "og:title");
      ogTitleTag.content = ogTitle;
      document.head.appendChild(ogTitleTag);
    };
  
    updateMetaTags();
  }, [imgUrl, title]);
  

  return (
    <Helmet title={title}>
       
      <CommonSection className='commsect' title={title} hideOnMobile={true}/>

      <section className="pt-0">
        <Container>
          <Row className="space">
            <Col lg="5">
              <div className="images">
                <Slider {...sliderSettings}>
                  <div onClick={() => setSelectedImageIndex(0)}>
                    <img src={imgUrl} alt="" />
                  </div>
                  {imgUrls &&
                    imgUrls.map((url, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImageIndex(index + 1)}
                      >
                        <img src={url} alt="" />
                      </div>
                    ))}
                </Slider>
                <div className="carDotsBox">{renderDots()}</div>
                {isImageHovered && (
                  <div
                    className="zoom-overlay"
                    style={{
                      backgroundImage: `url(${imgUrl})`,
                      backgroundPosition: `${-cursorPosition.x}px ${-cursorPosition.y}px`,
                    }}
                  />
                )}
              </div>
              <div className="delhivery product__details">
                <h5 className="mt-5"> delivery partner :</h5>
                <img className="dellog" src={dellog} alt="" />
              </div>
            </Col>

            <Col lg="7">
              <div className="product__details">
                <span className="title_prod">{title}</span>
                <div className="product__rating d-flex align-items-center gap-2 mb-3">
                  <div>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-half-s-fill"></i>
                    </span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-5">
                <div className="price0">
  <span>
    <strike>Rs.{!isNaN(price) ? Math.floor(2 * parseFloat(price)) : "Invalid Price"}</strike>
  </span>
  <span className="product__price">Rs.{price}</span>
</div>

                  
                  
                  <span>Category: {category}</span>
                </div>
              </div>
              

              <div className="product__details">
                {availableSizes && availableSizes.length > 0 && (
                  <div>
                    <label>Select Size:</label>
                    <div className={`size__buttons`}>
  {availableSizes.map((size) => (
    <button
      key={size}
      className={`size__button ${
        selectedSize === size ? "selected" : ""
      }`}
      onClick={() => handleSizeSelection(size)}
    >
      {size}
    </button>
  ))}
</div>

                  </div>
                )}
                {availableColors && availableColors.length > 0 && (
                  <div>
                    <label>Select Color:</label>
                    <div className="color__buttons">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          className={`color__button ${
                            selectedColor === color ? "selected" : ""
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorSelection(color)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className=" sticky-bottom">
                <div className="d-flex align-items-center gap-2">
                  
                  <button className="buy__button w-100 " onClick={addToCart}>
                    Add to Cart
                  </button>
                  <button
                    className="buy__button fav_button small_button w-100"
                    onClick={addToFavorites}
                  >
                    <i className="ri-heart-add-line"></i>
                  </button>
                </div>
              </div>

              <div className="product__details">
                <div className="multiline">{description}</div>
                

                {vimgurls && vimgurls.length > 0 && (
                  <div>
                    <label>Select Variant:</label>
                    <div className="variant-image-buttons-container">
                      {vimgurls.map((url, index) => (
                        <button
                          key={index}
                          className={`variant-image-button ${
                            selectedVariantIndex === index ? "selected" : ""
                          }`}
                          onClick={() => handleVariantSelection(index)}
                        >
                          <img src={url} alt={`Variant ${index}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
              </div>
              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  <p className="mt-3 mb-3 prod">{shortDesc}</p>
                </div>
              ) : (
                <div className="product__review mt-5"></div>
              )}
            </Col>
            <Col lg="12" className="mt-5">
              <h2 className="related__title">You might also like</h2>
            </Col>
            {bestSalesProducts && <ProductsList data={bestSalesProducts} />}
            <Col lg="12" className="mt-5">
              <h2 className="related__title">Also Buy</h2>
            </Col>
            {trendingProducts && <ProductsList data={trendingProducts} />}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
