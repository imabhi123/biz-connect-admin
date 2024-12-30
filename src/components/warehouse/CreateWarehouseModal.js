// import * as React from "react";
// import Modal from "@mui/material/Modal";
// import * as Yup from "yup";
// import { useSnackbar } from "notistack";
// import { useState, useEffect } from "react";
// // form
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// // @mui
// import { Box, Grid, Card, Stack } from "@mui/material";
// import { LoadingButton } from "@mui/lab";

// import { styled } from "@mui/material/styles";

// import Button from "@mui/material/Button";

// const Div = styled("div")(({ theme }) => ({
//   ...theme.typography.h5,
//   backgroundColor: theme.palette.background.paper,
//   padding: theme.spacing(1),
// }));

// // components
// import {
//   FormProvider,
//   RHFSelect,
//   RHFTextField,
// } from "../../components/hook-form";

// import Iconify from "../Iconify";

// import axios from "src/utils/axios";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 800,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

// const CreateWarehouseModal = (props) => {
//   const [open, setOpen] = React.useState(false);
//   const handleClose = () => setOpen(false);

//   const handleOpen = () => {
//     setOpen(true);
//     fetchStates();
//   };
//   const [allTehsils, setAllTehsils] = useState([]);
//   const [states, setStates] = useState([]);
//   const [activeState, setActiveState] = useState();

//   const [districts, setDistricts] = useState([]);
//   const [activeDistrict, setActiveDistrict] = useState();

//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     manager: "",
//     address: "",
//     tehsil: "",
//     pincode: "",
//   });

//   const { enqueueSnackbar } = useSnackbar();

//   const UpdateUserSchema = Yup.object().shape({
//     // name: Yup.string().required("Name is required"),
//   });

//   const methods = useForm({
//     resolver: yupResolver(UpdateUserSchema),
//   });

//   const {
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const fetchStates = async () => {
//     try {
//       const response = await axios.get(`/api/v1/lgd/state/?active=true`);
//       setStates(response.data.results);
//       if (response.data.results.length > 0) {
//         setActiveState(response.data.results[0].name);
//       } else {
//         setActiveState(null);
//       }
//     } catch (error) {
//       console.error("Error fetching States:", error);
//     }
//   };

//   const fetchDistricts = async () => {
//     try {
//       const response = await axios.get(
//         `/api/v1/lgd/district/?active=true&state=${activeState}`
//       );
//       setDistricts(response.data.results);
//       if (response.data.results.length > 0) {
//         setActiveDistrict(response.data.results[0].name);
//       } else {
//         setActiveDistrict("null");
//         setAllTehsils([]);
//       }
//     } catch (error) {
//       console.error("Error fetching Districts:", error);
//     }
//   };

//   const fetchTehsils = async () => {
//     try {
//       const response = await axios.get(
//         `/api/v1/lgd/subdistrict/?active=true&district=${activeDistrict}`
//       );
//       setAllTehsils(response.data.results);
//       if (response.data.results.length > 0) {
//         setFormData({
//           ...formData,
//           tehsil: response.data.results[0]?.id,
//           manager: props.allMgr[0]?.id,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching tehsil:", error);
//     }
//   };

//   const onSubmit = async () => {
//     console.log("onsubmit");
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       const response = await axios.post(
//         `/api/v1/warehouse/warehouse/`,
//         formData
//       );
//       if (response.status === 201 || response.status === 204) {
//         enqueueSnackbar("Warehouse Created");
//         props.addRow();
//       } else {
//         console.error("Failed to update warehouse:", response.data);
//         enqueueSnackbar("Creation failed!", { variant: "error" });
//       }
//     } catch (error) {
//       console.error(error);
//       enqueueSnackbar("Creation failed!", { variant: "error" });
//     } finally {
//       handleClose();
//     }
//   };

//   const handleInputChange = (field, value) => {
//     if (field == "state") {
//       setActiveState(value);
//     } else if (field == "district") {
//       setActiveDistrict(value);
//     } else if (field == "pincode") {
//       value = value.slice(0, 6);
//     } else if (field == "phone") {
//       value = value.slice(0, 10);
//     }
//     setFormData({
//       ...formData,
//       [field]: value,
//     });
//   };

//   useEffect(() => {
//     if (activeState) {
//       fetchDistricts();
//     }
//   }, [activeState]);

//   useEffect(() => {
//     if (activeDistrict) {
//       fetchTehsils();
//     }
//   }, [activeDistrict]);

//   return (
//     <div>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleOpen}
//         startIcon={<Iconify icon="eva:plus-fill" align="right" />}
//       >
//         New Warehouse
//       </Button>

//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <FormProvider
//             methods={methods}
//             onSubmit={handleSubmit(onSubmit)}
//             id="create-warehouse"
//           >
//             <Grid container spacing={4}>
//               <Grid item xs={12} md={12} sm={8}>
//                 <Div>{"Create Warehosue"}</Div>
//                 <Card sx={{ p: 3 }}>
//                   <Box
//                     sx={{
//                       display: "grid",
//                       rowGap: 3,
//                       columnGap: 2,
//                       gridTemplateColumns: {
//                         xs: "repeat(1, 1fr)",
//                         sm: "repeat(2, 1fr)",
//                       },
//                     }}
//                   >
//                     <RHFTextField
//                       name="name"
//                       label="Name"
//                       placeholder="Name"
//                       value={formData.name || ""}
//                       onChange={(e) =>
//                         handleInputChange("name", e.target.value)
//                       }
//                       required
//                     />
//                     <RHFSelect
//                       name="manager"
//                       label="Manager"
//                       placeholder="Manager"
//                       onChange={(e) =>
//                         handleInputChange("manager", e.target.value)
//                       }
//                       required
//                     >
//                       {props.allMgr.map((option) => (
//                         <option key={option.id} value={option.id}>
//                           {option.name}
//                         </option>
//                       ))}
//                     </RHFSelect>
//                     <RHFTextField
//                       name="phone"
//                       label="Phone Number"
//                       value={formData.phone || ""}
//                       onChange={(e) =>
//                         handleInputChange("phone", e.target.value)
//                       }
//                       inputProps={{
//                         type: "number",
//                         inputMode: "numeric",
//                         min: 1111111111,
//                         max: 9999999999,
//                       }}
//                       required
//                     />

//                     <RHFTextField
//                       name="address"
//                       label="Address"
//                       value={formData.address || ""}
//                       onChange={(e) =>
//                         handleInputChange("address", e.target.value)
//                       }
//                       required
//                     />
//                     <RHFSelect
//                       name="state"
//                       label="State"
//                       placeholder="State"
//                       onChange={(e) =>
//                         handleInputChange("state", e.target.value)
//                       }
//                       required
//                     >
//                       {states.map((option) => (
//                         <option key={option.name} value={option.name}>
//                           {option.name}
//                         </option>
//                       ))}
//                     </RHFSelect>
//                     <RHFSelect
//                       name="district"
//                       label="District"
//                       placeholder="District"
//                       onChange={(e) =>
//                         handleInputChange("district", e.target.value)
//                       }
//                       required
//                     >
//                       {districts.map((option) => (
//                         <option key={option.name} value={option.name}>
//                           {option.name}
//                         </option>
//                       ))}
//                     </RHFSelect>
//                     <RHFSelect
//                       name="tehsil"
//                       label="Tehsil"
//                       placeholder="Tehsil"
//                       value={formData.tehsil || ""}
//                       onChange={(e) =>
//                         handleInputChange("tehsil", e.target.value)
//                       }
//                       required
//                     >
//                       {allTehsils.map((option) => (
//                         <option key={option.id} value={option.id}>
//                           {option.name}
//                         </option>
//                       ))}
//                     </RHFSelect>
//                     <RHFTextField
//                       name="Pincode"
//                       label="Pincode"
//                       value={formData.pincode || ""}
//                       onChange={(e) =>
//                         handleInputChange("pincode", e.target.value)
//                       }
//                       inputProps={{
//                         type: "number",
//                         inputMode: "numeric",
//                         min: 111111,
//                         max: 999999,
//                       }}
//                       required
//                     />
//                   </Box>
//                   <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
//                     <LoadingButton
//                       type="submit"
//                       variant="contained"
//                       loading={isSubmitting}
//                     >
//                       Create
//                     </LoadingButton>
//                   </Stack>
//                 </Card>
//               </Grid>
//             </Grid>
//           </FormProvider>
//         </Box>
//       </Modal>
//     </div>
//   );
// };
// export default CreateWarehouseModal;

import React from 'react'

const CreateWarehouseModal = () => {
  return (
    <div>CreateWarehouseModal</div>
  )
}

export default CreateWarehouseModal