import * as React from "react";
import Modal from "@mui/material/Modal";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// hooks
import useAuth from "../../hooks/useAuth";
// utils
import { fData } from "../../utils/formatNumber";
// _mock
import { countries } from "../../_mock";
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from "../../components/hook-form";

import MenuItem from "@mui/material/MenuItem";
import Iconify from "../Iconify";
import { Avatar } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditUserModal = (props) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required("Name is required"),
  });

  const defaultValues = {
    displayName: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
    phoneNumber: user?.phoneNumber || "",
    country: user?.country || "",
    address: user?.address || "",
    state: user?.state || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    about: user?.about || "",
    isPublic: user?.isPublic || false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar("Update success!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "photoURL",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );
  return (
    <div>
      {console.log(props)}
      <MenuItem onClick={handleOpen}>
        <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
        Edit
      </MenuItem>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
                  <Avatar
                    alt="Remy Sharp"
                    src={props.avatarUrl}
                    sx={{ width: 150, height: 150 }}
                  />
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "grid",
                      rowGap: 3,
                      columnGap: 2,
                      gridTemplateColumns: {
                        xs: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                      },
                    }}
                  >
                    {console.log(props.name)}
                    <RHFTextField
                      name="displayName"
                      label="Name"
                      value={props.name}
                    />
                    <RHFTextField
                      name="email"
                      label="Email Address"
                      value={props.email}
                    />

                    <RHFTextField name="phoneNumber" label="Phone Number" />
                    <RHFTextField name="address" label="Address" />

                    <RHFSelect
                      name="country"
                      label="Country"
                      placeholder="Country"
                    >
                      <option value="" />
                      {countries.map((option) => (
                        <option key={option.code} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </RHFSelect>

                    <RHFTextField name="state" label="State/Region" />

                    <RHFTextField name="city" label="City" />
                    <RHFTextField name="zipCode" label="Zip/Code" />
                  </Box>

                  <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                    <RHFTextField
                      name="about"
                      multiline
                      rows={4}
                      label="About"
                    />

                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Save Changes
                    </LoadingButton>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
};
export default EditUserModal;
