import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    TextField,
    Button,
    Chip,
    FormControl,
    InputLabel,
    Paper,
    Typography,
    Tooltip,
    IconButton,
    Alert,
    Snackbar,
    FormHelperText,
    Fade,
    useTheme
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';

const INITIAL_COUPON = {
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expiryDate: '',
    usageLimit: 1,
    status: 'active',
    usedCount: 0
};

const CouponManagement = () => {
    const theme = useTheme();
    const [filterName, setFilterName] = useState('');
    const [coupons, setCoupons] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);

    // Modal states
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Form states
    const [currentCoupon, setCurrentCoupon] = useState(INITIAL_COUPON);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const fetchCoupons = async () => {
        try {
            const response = await axios.get('https://biz-connect-livid.vercel.app/api/v1/promo/promocodes');
            setCoupons(response.data);
            console.log(response.data);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchCoupons();
    }, [])

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!currentCoupon.code) newErrors.code = 'Code is required';
        if (!currentCoupon.discountValue) newErrors.discountValue = 'Discount value is required';
        if (currentCoupon.discountValue < 0) newErrors.discountValue = 'Discount value must be positive';
        if (currentCoupon.discountType === 'percentage' && currentCoupon.discountValue > 100) {
            newErrors.discountValue = 'Percentage cannot exceed 100%';
        }
        if (!currentCoupon.expiryDate) newErrors.expiryDate = 'Expiry date is required';
        if (currentCoupon.usageLimit < 1) newErrors.usageLimit = 'Usage limit must be at least 1';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateClick = () => {
        setCurrentCoupon(INITIAL_COUPON);
        setErrors({});
        setOpenCreateModal(true);
    };

    const handleEditClick = (coupon) => {
        setCurrentCoupon(coupon);
        setErrors({});
        setOpenEditModal(true);
    };

    const handleDeleteClick = (coupon) => {
        setCurrentCoupon(coupon);
        setOpenDeleteModal(true);
    };

    const handleCreateSubmit = async () => {
        if (!validateForm()) return;
        console.log(currentCoupon)
        try {
            const response = await axios.post('https://biz-connect-livid.vercel.app/api/v1/promo/promocodes', currentCoupon);
            console.log(response.data)
            const newCoupon = {
                ...currentCoupon,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            setCoupons([...coupons, newCoupon]);
            setOpenCreateModal(false);
            showNotification('Coupon created successfully');
        } catch (error) {
            showNotification('Failed to create coupon', 'error');
        }
    };

    const handleEditSubmit = async () => {
        if (!validateForm()) return;
        console.log(currentCoupon)
        try {
            const response = await axios.put(`https://biz-connect-livid.vercel.app/api/v1/promo/promocodes/${currentCoupon?._id}`, currentCoupon);
            console.log(response.data)
            const newCoupon = {
                ...currentCoupon,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // setCoupons([...coupons, newCoupon]);
            setOpenEditModal(false);
            showNotification('Coupon created successfully');
        } catch (error) {
            showNotification('Failed to create coupon', 'error');
        }
    };

    const handleDeleteSubmit = async () => {
        try {
            setCoupons(coupons.filter(c => c.code !== currentCoupon.code));
            setOpenDeleteModal(false);
            showNotification('Coupon deleted successfully');
        } catch (error) {
            showNotification('Failed to delete coupon', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'expired':
                return 'error';
            case 'disabled':
                return 'default';
            default:
                return 'default';
        }
    };


    const renderCouponForm = () => (
        <div className="space-y-4 pt-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            <FormControl fullWidth error={!!errors.code}>
                <TextField
                    label="Coupon Code"
                    value={currentCoupon.code}
                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, code: e.target.value.toUpperCase() })}
                    // disabled={openEditModal}
                    error={!!errors.code}
                    helperText={errors.code}
                    InputProps={{
                        endAdornment: (
                            <Tooltip title="Coupon code must be unique and will be converted to uppercase">
                                <IconButton size="small">
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>
                        ),
                    }}
                />
            </FormControl>

            <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                    value={currentCoupon.discountType}
                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountType: e.target.value })}
                    label="Discount Type"
                >
                    <MenuItem value="percentage">Percentage (%)</MenuItem>
                    <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth error={!!errors.discountValue}>
                <TextField
                    label="Discount Value"
                    type="number"
                    value={currentCoupon.discountValue}
                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, discountValue: e.target.value })}
                    error={!!errors.discountValue}
                    helperText={errors.discountValue}
                />
            </FormControl>

            <FormControl fullWidth error={!!errors.expiryDate}>
                <TextField
                    label="Expiry Date"
                    type="date"
                    value={currentCoupon.expiryDate}
                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, expiryDate: e.target.value })}
                    error={!!errors.expiryDate}
                    helperText={errors.expiryDate}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </FormControl>

            <FormControl fullWidth error={!!errors.usageLimit}>
                <TextField
                    label="Usage Limit"
                    type="number"
                    value={currentCoupon.usageLimit}
                    onChange={(e) => setCurrentCoupon({ ...currentCoupon, usageLimit: e.target.value })}
                    error={!!errors.usageLimit}
                    helperText={errors.usageLimit}
                />
            </FormControl>
        </div>
    );

    return (
        <Card>
            <CardHeader
                title="Coupon Management"
                action={<>
                    {coupons.length < 1 && <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateClick}
                    >
                        Create Coupon
                    </Button>}
                </>
                }
            />
            <CardContent>
                {/* <TextField
          label="Filter by code"
          variant="outlined"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          style={{ marginBottom: '1rem' }}
          fullWidth
        /> */}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ minWidth: 'fit-content' }}>Code</TableCell>
                                <TableCell sx={{ minWidth: 'fit-content' }}>Discount</TableCell>
                                <TableCell sx={{ minWidth: 'fit-content' }}>Expiry Date</TableCell>
                                <TableCell sx={{ minWidth: 'fit-content' }}>Usage</TableCell>
                                <TableCell sx={{ minWidth: 'fit-content' }}>Status</TableCell>
                                <TableCell sx={{ minWidth: 'fit-content' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {coupons.map((coupon) => (
                                <TableRow key={coupon.code}>
                                    <TableCell>{coupon.code}</TableCell>
                                    <TableCell>
                                        {coupon.discountValue}
                                        {coupon.discountType === 'percentage' ? '%' : '$'}
                                    </TableCell>
                                    <TableCell>{format(new Date(coupon.expiryDate), 'MMM dd, yyyy')}</TableCell>
                                    <TableCell>{`${coupon.usedCount}/${coupon.usageLimit}`}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={coupon.status}
                                            color={getStatusColor(coupon.status)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditClick(coupon)}>
                                            <EditIcon />
                                        </IconButton>
                                        {/* <IconButton onClick={() => handleDeleteClick(coupon)}>
                                            <DeleteIcon />
                                        </IconButton> */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Create/Edit Modal */}
                <Dialog
                    open={openCreateModal || openEditModal}
                    onClose={() => {
                        setOpenCreateModal(false);
                        setOpenEditModal(false);
                    }}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        {openCreateModal ? 'Create Coupon' : 'Edit Coupon'}
                    </DialogTitle>
                    <DialogContent>
                        {renderCouponForm()}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpenCreateModal(false);
                                setOpenEditModal(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={openCreateModal ? handleCreateSubmit : handleEditSubmit}
                        >
                            {openCreateModal ? 'Create' : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog
                    open={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
                >
                    <DialogTitle>Delete Coupon</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete coupon {currentCoupon.code}?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteSubmit}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Notification */}
                <Snackbar
                    open={notification.show}
                    autoHideDuration={3000}
                    onClose={() => setNotification({ ...notification, show: false })}
                    TransitionComponent={Fade}

                >
                    <Alert sx={{
                        width: '100%',
                        boxShadow: theme.shadows[3]
                    }} severity={notification.type} variant="filled" onClose={() => setNotification({ ...notification, show: false })}>
                        {notification.message}
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
};

export default CouponManagement;