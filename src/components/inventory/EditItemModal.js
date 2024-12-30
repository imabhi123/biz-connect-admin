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
// import { INVENTORY_ITEM_CODE_TYPE, INVENTORY_UNITS } from "src/config";

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

// const EditItemModal = (props) => {
//   const [open, setOpen] = React.useState(false);
//   const [formData, setFormData] = useState(props.formData);
//   const handleClose = () => setOpen(false);

//   const handleOpen = () => {
//     setOpen(true);
//   };

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

//   const onSubmit = async () => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       const response = await axios.patch(
//         `/api/v1/inventory/itemmaster/${formData.item_id}/`,
//         formData
//       );
//       if (response.status === 200 || response.status === 204) {
//         enqueueSnackbar("Update success!");
//         setFormData(response.data);
//         props.changeDataAfterUpdate(response.data);
//       } else {
//         console.error("Failed to update Inventory item:", response.data);
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
//                 <Div>{"Edit Inventory Item"}</Div>
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
//                       onChange={(e) =>
//                         handleInputChange("name", e.target.value)
//                       }
//                       value={formData.name}
//                       required
//                     />
//                     <RHFSelect
//                       name="unit"
//                       label="Unit"
//                       placeholder="Unit"
//                       value={formData.unit}
//                       onChange={(e) =>
//                         handleInputChange("unit", e.target.value)
//                       }
//                       required
//                     >
//                       {INVENTORY_UNITS.map((option) => (
//                         <option key={option.id} value={option.id}>
//                           {option.name}
//                         </option>
//                       ))}
//                     </RHFSelect>

//                     <RHFSelect
//                       name="code_type"
//                       label="Identity"
//                       placeholder="Identity"
//                       value={formData.code_type}
//                       onChange={(e) =>
//                         handleInputChange("code_type", e.target.value)
//                       }
//                       required
//                     >
//                       {INVENTORY_ITEM_CODE_TYPE.map((option) => (
//                         <option key={option.id} value={option.id}>
//                           {option.name}
//                         </option>
//                       ))}
//                     </RHFSelect>
//                     <RHFTextField
//                       name="bar_code"
//                       label="Bar Code"
//                       value={formData.bar_code ?? ""}
//                       onChange={(e) =>
//                         handleInputChange("bar_code", e.target.value)
//                       }
//                     />
//                     <RHFTextField
//                       name="desc"
//                       label="Desc"
//                       value={formData.desc ?? ""}
//                       onChange={(e) =>
//                         handleInputChange("desc", e.target.value)
//                       }
//                     />
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
// export default EditItemModal;

import React from 'react'

const EditItemModal = () => {
  return (
    <div>EditItemModal</div>
  )
}

export default EditItemModal