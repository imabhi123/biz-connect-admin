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

// import MenuItem from "@mui/material/MenuItem";
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

// const EditWarehouseModal = (props) => {
//   const [open, setOpen] = React.useState(false);
//   const [formData, setFormData] = useState(props.formData);
//   // const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleOpen = () => {
//     setOpen(true);
//     fetchTehsils();
//   };
//   const [allTehsils, setAllTehsils] = useState([]);

//   const { enqueueSnackbar } = useSnackbar();

//   const UpdateUserSchema = Yup.object().shape({
//     name: Yup.string().required("Name is required"),
//   });

//   const methods = useForm({
//     resolver: yupResolver(UpdateUserSchema),
//     defaultValues: formData,
//   });

//   const {
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const fetchTehsils = async () => {
//     try {
//       const response = await axios.get(
//         `/api/v1/lgd/subdistrict/?district=${formData.district}`
//       );
//       setAllTehsils(response.data.results);
//     } catch (error) {
//       console.error("Error fetching tehsil:", error);
//     }
//   };

//   const onSubmit = async () => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       const response = await axios.patch(
//         `/api/v1/warehouse/warehouse/${formData.id}/`,
//         formData
//       );
//       if (response.status === 200 || response.status === 204) {
//         enqueueSnackbar("Update success!");
//         setFormData(response.data);
//         props.changeDataAfterUpdate(response.data);
//       } else {
//         console.error("Failed to update warehouse:", response.data);
//         enqueueSnackbar("Update failed!", { variant: "error" });
//       }
//     } catch (error) {
//       console.error(error);
//       enqueueSnackbar("Update failed!", { variant: "error" });
//     } finally {
//       handleClose();
//     }
//   };

//   const handleInputChange = (field, value) => {
//     if (field == "phone") {
//       value = value.slice(0, 10);
//     } else if (field == "pincode") {
//       value = value.slice(0, 6);
//     }
//     setFormData({
//       ...formData,
//       [field]: value,
//     });
//   };

//   useEffect(() => {
//     setFormData({
//       ...formData,
//     });
//   }, []);

//   return (
//     <div>
//       {/* {console.log(formData)} */}
//       <MenuItem onClick={handleOpen}>
//         <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
//         Edit
//       </MenuItem>
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
//             id="edit-warehouse"
//           >
//             <Grid container spacing={4}>
//               <Grid item xs={12} md={12} sm={8}>
//                 <Div>{"Edit Warehosue"}</Div>
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
//                       name="displayName"
//                       label="Name"
//                       onChange={(e) =>
//                         handleInputChange("name", e.target.value)
//                       }
//                       value={formData.name}
//                       required
//                     />
//                     <RHFSelect
//                       name="manager"
//                       label="Manager"
//                       placeholder="Manager"
//                       value={formData.manager}
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
//                       value={formData.phone ?? ""}
//                       onChange={(e) =>
//                         handleInputChange("phone", e.target.value)
//                       }
//                       inputProps={{
//                         type: "number",
//                         inputMode: "numeric",
//                         min: 0,
//                         max: 9999999999,
//                       }}
//                       required
//                     />

//                     <RHFTextField
//                       name="address"
//                       label="Address"
//                       value={formData.address ?? ""}
//                       onChange={(e) =>
//                         handleInputChange("address", e.target.value)
//                       }
//                     />

//                     <RHFTextField
//                       name="pincode"
//                       label="pincode"
//                       value={formData.pincode ?? ""}
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

//                     <RHFSelect
//                       name="tehsil"
//                       label="Tehsil"
//                       placeholder="Tehsil"
//                       value={formData.tehsil}
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
//                   </Box>
//                   <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
//                     <LoadingButton
//                       type="submit"
//                       variant="contained"
//                       loading={isSubmitting}
//                     >
//                       Save Changes
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
// export default EditWarehouseModal;

import React from 'react'

const EditWarehouseModal = () => {
  return (
    <div>EditWarehouseModal</div>
  )
}

export default EditWarehouseModal