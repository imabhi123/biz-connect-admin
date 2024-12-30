import * as React from "react";
import Modal from "@mui/material/Modal";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Box, Grid, Card, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// components
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "../../components/hook-form";

import MenuItem from "@mui/material/MenuItem";
import Iconify from "../Iconify";
import { Avatar } from "@mui/material";

import axios from "src/utils/axios";

import { styled } from '@mui/material/styles';

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.h5,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

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
  const [formData, setFormData] = useState(props.formData);
  const [selectedGroup, setSelectedGroup] = useState(props.formData.groups?.[0]?.id || null);
  // console.log(props);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { enqueueSnackbar } = useSnackbar();

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues: formData,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await axios.patch(
        `/api/v1/accounts/users/${formData.id}/`,
        formData
      );
      if (response.status === 200 || response.status === 204) {
        enqueueSnackbar("Update success!");
        props.changeDataAfterUpdate(response.data);
      } else {
        console.error("Failed to update user:", response.data);
        enqueueSnackbar("Update failed!", { variant: "error" });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Update failed!", { variant: "error" });
    } finally {
      handleClose();
    }
  };

  const handleInputChange = (field, value) => {
    if (field == "groups") {
      value = value === "" ? [] : [value];
    } else if (field == "phone_number") {
      value = value.slice(0, 10);
    }
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      ['groups']: selectedGroup ? [selectedGroup] : [],
    });
  }, []);

  return (
    <div>
      {/* {console.log(props)} */}
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
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} id="edit-user">
          <Div>{"Edit User"}</Div>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
                  <Avatar
                    alt={formData.name}
                    src={formData.avatarUrl}
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
                    <RHFTextField
                      name="displayName"
                      label="Name"
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      value={formData.name}
                      required
                    />
                    <RHFTextField
                      name="email"
                      label="Email Address"
                      value={formData.email}
                      required
                    />

                    <RHFTextField
                      name="phone_number"
                      label="Phone Number"
                      value={formData.phone_number}
                      onChange={(e) =>
                        handleInputChange("phone_number", e.target.value)
                      }
                      inputProps={{
                        type: "number",
                        inputMode: "numeric",
                        min: 0,
                        max: 9999999999,
                      }}
                      required
                    />
                    <RHFTextField
                      name="address"
                      label="Address"
                      value={formData.address ?? ""}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                    />
                    <RHFTextField
                      name="city"
                      label="City"
                      value={formData.city ?? ""}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      required
                    />
                    <RHFSelect
                      name="group"
                      label="Group"
                      placeholder="Group"
                      defaultValue={selectedGroup}
                      onChange={(e) =>
                        handleInputChange("groups", e.target.value)
                      }
                      required
                    >
                      {props.allGroups.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </RHFSelect>
                  </Box>

                  <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                    <RHFTextField
                      name="about"
                      multiline
                      rows={4}
                      label="About"
                      value={formData.about ?? ""}
                      onChange={(e) =>
                        handleInputChange("about", e.target.value)
                      }
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
