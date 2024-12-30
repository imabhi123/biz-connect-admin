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

// const CreateItemModal = (props) => {
//   const [open, setOpen] = React.useState(false);
//   const handleClose = () => setOpen(false);

//   const handleOpen = () => {
//     setOpen(true);
//   };
//   const [formData, setFormData] = useState({
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

//   const onSubmit = async () => {
//     console.log("onsubmit");
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       const response = await axios.post(
//         `/api/v1/inventory/itemmaster/`,
//         formData
//       );
//       if (response.status === 201 || response.status === 204) {
//         enqueueSnackbar("Item Created");
//         props.addRow();
//       } else {
//         console.error("Failed to update Item:", response.data);
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
//     setFormData({
//       ...formData,
//       [field]: value,
//     });
//   };

//   return (
//     <div>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleOpen}
//         startIcon={<Iconify icon="eva:plus-fill" align="right" />}
//       >
//         New Item
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
//             id="create-inventoryitem"
//           >
//             <Grid container spacing={4}>
//               <Grid item xs={12} md={12} sm={8}>
//                 <Div>{"Create Inventory Item"}</Div>
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
//                       name="unit"
//                       label="Unit"
//                       placeholder="Unit"
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
//                       value={formData.desc || ""}
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
// export default CreateItemModal;
import React from 'react'

const CreateItemModal = () => {
  return (
    <div>CreateItemModal</div>
  )
}

export default CreateItemModal
