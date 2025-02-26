import "./App.css";
import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Box,
  Button,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  Rating,
  Modal,
} from "@mui/material";
import { Pagination } from "@mui/material";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState();
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [modelOpen, setModelOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: null,
    category: "",
    description: "",
    ratings: 0,
    stock: 0,
    seller: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };
  const handleOpenModel = () => setModelOpen(true);
  const handleCloseModel = () => setModelOpen(false);

  const limit = 10;

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    axios
      .get(`http://localhost:8000/api/products/search?q=${searchTerm}`)
      .then((res) => {
        console.log("res3242", res);

        setProducts(res?.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilter = () => {
    let query = [];

    if (productName !== "") query.push(`name=${productName}`);
    if (productCategory !== "") query.push(`category=${productCategory}`);
    if (productPrice !== "") query.push(`price=${productPrice}`);

    const queryString = query.length ? `?${query.join("&")}` : "";
    axios
      .get(`http://localhost:8000/api/products${queryString}`)
      .then((res) => {
        console.log("res545", res);

        setProducts(res?.data?.products);
        setProductData(res?.data?.totalPages);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  const GetProductData = () => {
    axios
      .get(`http://localhost:8000/api/products?page=${page}&limit=${limit}`)
      .then((res) => {
        setProducts(res?.data?.products);
        setProductData(res?.data?.totalPages);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  useEffect(() => {
    GetProductData();
  }, [page]);
  const handleSubmit = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("ratings", formData.ratings);
    data.append("seller", formData.seller);
    data.append("stock", formData.stock);
    console.log("formData.image", formData.image);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/products",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Success:", response.data);
      setFormData({
        name: "",
        price: "",
        image: null,
        category: "",
        description: "",
        ratings: 0,
        stock: 0,
        seller: "",
      });
      handleCloseModel();
      GetProductData();
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };
  return (
    <div className="App">
      <Box sx={{ flexGrow: 1, margin: 3 }}>
        <Grid container spacing={2}>
          <Grid size={5}>
            <Typography
              sx={{ fontSize: "25px", fontWeight: "bold", marginLeft: "20px" }}
            >
              Products
            </Typography>
          </Grid>
          <Grid size={3}>
            <TextField
              label="Search Products"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
            />
          </Grid>
          <Grid size={2}>
            <Button
              variant="contained"
              sx={{
                height: "55px",
                width: "100%",
                textTransform: "capitalize",
              }}
              onClick={handleClick}
            >
              Filter
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  width: "350px",
                  marginTop: "10px",
                  padding: "20px",
                },
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Product Name</InputLabel>
                <Select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  label="Select Option"
                >
                  {products?.map((val) => {
                    return <MenuItem value={val?.name}>{val?.name}</MenuItem>;
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  label="Select Option"
                >
                  {products?.map((val) => {
                    return (
                      <MenuItem value={val?.category}>{val?.category}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Price</InputLabel>
                <Select
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  label="Price"
                >
                  {products?.map((val) => {
                    return <MenuItem value={val?.price}>{val?.price}</MenuItem>;
                  })}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                sx={{ height: "55px", width: "50%", mt: 2 }}
                onClick={handleFilter}
              >
                Submit
              </Button>
            </Menu>
          </Grid>
          <Grid size={2}>
            <Button
              variant="contained"
              sx={{
                height: "55px",
                width: "100%",
                backgroundColor: "green",
                textTransform: "capitalize",
              }}
              onClick={handleOpenModel}
            >
              Add Product
            </Button>
            <Modal open={modelOpen} onClose={handleCloseModel}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 700,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <Grid container spacing={2} mb={2}>
                  <Grid size={8}>
                    <Typography variant="h6" component="h2">
                      Add Product
                    </Typography>
                  </Grid>
                  <Grid size={4} display={"flex"} justifyContent={"end"}>
                    <CloseIcon onClick={handleCloseModel} />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      label="Product Name"
                      variant="outlined"
                      fullWidth
                      value={formData.name}
                      name="name"
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Price"
                      variant="outlined"
                      fullWidth
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                    />{" "}
                    <TextField
                      label="Seller"
                      variant="outlined"
                      fullWidth
                      name="seller"
                      value={formData.seller}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                    />{" "}
                    <TextField
                      label="Description"
                      variant="outlined"
                      fullWidth
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      label="Category"
                      variant="outlined"
                      fullWidth
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Ratings"
                      variant="outlined"
                      fullWidth
                      name="ratings"
                      value={formData.ratings}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                    />{" "}
                    <TextField
                      label="Stock"
                      variant="outlined"
                      fullWidth
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                    />{" "}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Grid>
                </Grid>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      height: "45px",
                      width: "30%",
                      backgroundColor: "green",
                      textTransform: "capitalize",
                    }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </Box>
            </Modal>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1, margin: 5 }}>
        <Grid container spacing={2}>
          {products?.map((val) => {
            return (
              <Grid size={3}>
                <Card sx={{ padding: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={`http://localhost:8000/${val.images?.[0]}`}
                      alt={val.name}
                      style={{
                        width: "70%",
                        height: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <Typography
                    sx={{ fontSize: "20px", fontWeight: "bold", mt: 2 }}
                  >
                    {val.name}
                  </Typography>
                  <Typography sx={{ fontSize: "15px", mt: 1 }}>
                    {val?.description ? val?.description : "-"}
                  </Typography>
                  <Typography sx={{ fontSize: "15px", mt: 1 }}>
                    <span style={{ fontWeight: "bold" }}>Price</span>&nbsp; :{" "}
                    {val?.price ? val?.price : "-"}
                  </Typography>
                  <Typography sx={{ fontSize: "15px", mt: 1 }}>
                    <span style={{ fontWeight: "bold" }}>Seller</span>&nbsp; :{" "}
                    {val?.seller ? val?.seller : "-"}
                  </Typography>
                  <Typography sx={{ fontSize: "15px", mt: 1 }}>
                    <span style={{ fontWeight: "bold" }}>Stock</span>&nbsp; :{" "}
                    {val?.stock ? val?.stock : "-"}
                  </Typography>
                  <Rating
                    value={val?.ratings}
                    precision={0.5}
                    readOnly
                    sx={{ mt: 1 }}
                  />
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {productData > 1 && (
          <Pagination
            count={productData}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        )}
      </div>
    </div>
  );
}

export default App;
