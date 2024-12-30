import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    MenuItem,
    Chip,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    Grid
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Check as CheckIcon,
    Close as CloseIcon
} from '@mui/icons-material';

const PlanManagement = () => {
    const [plans, setPlans] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: 'monthly',
        features: [''],
        discount: 0,
        isActive: true
    });

    // Fetch plans on component mount
    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await fetch('https://biz-connect-livid.vercel.app/api/v1/plans');
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            showSnackbar('Failed to fetch plans', 'error');
        }
    };

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setFormData({ ...plan });
            setSelectedPlan(plan);
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                duration: 'monthly',
                features: [''],
                discount: 0,
                isActive: true
            });
            setSelectedPlan(null);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPlan(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData(prev => ({
            ...prev,
            features: newFeatures
        }));
    };

    const addFeatureField = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const removeFeatureField = (index) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            features: newFeatures
        }));
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = selectedPlan
                ? `https://biz-connect-livid.vercel.app/api/v1/plans/${selectedPlan._id}`
                : 'https://biz-connect-livid.vercel.app/api/v1/plans';
            const method = selectedPlan ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to save plan');

            showSnackbar(`Plan ${selectedPlan ? 'updated' : 'created'} successfully`);
            handleCloseModal();
            fetchPlans();
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`https://biz-connect-livid.vercel.app/api/v1/plans/${selectedPlan._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete plan');

            showSnackbar('Plan deleted successfully');
            setOpenDeleteDialog(false);
            fetchPlans();
        } catch (error) {
            showSnackbar(error.message, 'error');
        }
    };

    return (
        <Container maxWidth="" sx={{ py: 4, width: '100%', paddingX: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Plan Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                >
                    Create New Plan
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Features</TableCell>
                            <TableCell>Discount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plans.map((plan) => (
                            <TableRow key={plan._id}>
                                <TableCell>{plan.name}</TableCell>
                                <TableCell>{plan.description}</TableCell>
                                <TableCell>${plan.price}</TableCell>
                                <TableCell>{plan.duration}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {plan.features.map((feature, index) => (
                                            <Chip key={index} label={feature} size="small" />
                                        ))}
                                    </Box>
                                </TableCell>
                                <TableCell>{plan.discount}%</TableCell>
                                <TableCell>
                                    <Chip
                                        label={plan.isActive ? 'Active' : 'Inactive'}
                                        color={plan.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{display:'flex',alignItems:'center',minHeight:'100%',flex:'1'}}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenModal(plan)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => {
                                            setSelectedPlan(plan);
                                            setOpenDeleteDialog(true);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create/Edit Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedPlan ? 'Edit Plan' : 'Create New Plan'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="name"
                                label="Plan Name"
                                fullWidth
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="price"
                                label="Price"
                                type="number"
                                fullWidth
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Duration</InputLabel>
                                <Select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    label="Duration"
                                >
                                    <MenuItem value="monthly">Monthly</MenuItem>
                                    <MenuItem value="quarterly">Quarterly</MenuItem>
                                    <MenuItem value="yearly">Yearly</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="discount"
                                label="Discount (%)"
                                type="number"
                                fullWidth
                                value={formData.discount}
                                onChange={handleInputChange}
                                InputProps={{ inputProps: { min: 0, max: 100 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Features
                            </Typography>
                            {formData.features.map((feature, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField
                                        fullWidth
                                        label={`Feature ${index + 1}`}
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    />
                                    <IconButton
                                        color="error"
                                        onClick={() => removeFeatureField(index)}
                                        disabled={formData.features.length === 1}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={addFeatureField}
                            >
                                Add Feature
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {selectedPlan ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the plan "{selectedPlan?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default PlanManagement;