import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  Avatar, 
  LinearProgress, 
  Card, 
  CardContent, 
  CardHeader,
  Chip,
  IconButton
} from '@mui/material';
import { 
  DashboardOutlined, 
  PeopleAltOutlined, 
  BarChartOutlined, 
  NotificationsActiveOutlined,
  RefreshOutlined,
  VisibilityOutlined
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router';

// Sample Data
const communityEngagementData = [
  { name: 'May', comments: 15, reactions: 10 },
  { name: 'Jun', comments: 20, reactions: 15 },
  { name: 'Jul', comments: 25, reactions: 20 },
  { name: 'Aug', comments: 30, reactions: 25 },
  { name: 'Sep', comments: 40, reactions: 35 },
  { name: 'Oct', comments: 50, reactions: 45 },
];

const QuickStatCard = ({ icon, title, value, color, subtitle }) => (
  <Card 
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      background: `linear-gradient(145deg, ${color}33, ${color}11)`,
      boxShadow: `0 4px 10px ${color}22`
    }}
    elevation={3}
  >
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Avatar 
          sx={{ 
            bgcolor: `${color}22`, 
            color: color, 
            width: 56, 
            height: 56 
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h5" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate=useNavigate();
  
  useEffect(()=>{
    navigate('/dashboard/profile');
  },[])

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };
  return null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Header */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', 
              color: 'white',
              borderRadius: 2 
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" gutterBottom>
                Admin Dashboard
              </Typography>
              <IconButton 
                color="inherit" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshOutlined />
              </IconButton>
            </Box>
            {isRefreshing && <LinearProgress color="secondary" />}
            <Typography variant="subtitle1">
              Welcome back! Here's an overview of your community metrics.
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickStatCard 
              icon={<VisibilityOutlined />}
              title="Profile Views"
              value="250"
              color="#2196f3"
              subtitle="Last Week"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickStatCard 
              icon={<PeopleAltOutlined />}
              title="Clubs"
              value="34"
              color="#4caf50"
              subtitle="Active Chapters"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickStatCard 
              icon={<BarChartOutlined />}
              title="Offers"
              value="15"
              color="#ff9800"
              subtitle="Ongoing Promotions"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickStatCard 
              icon={<NotificationsActiveOutlined />}
              title="Notifications"
              value="12"
              color="#9c27b0"
              subtitle="Unread Alerts"
            />
          </Grid>
        </Grid>

        {/* Community Engagement Chart */}
        <Grid item xs={12} lg={8}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardHeader 
              title="Community Engagement" 
              subheader="Activity over the last 6 months" 
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={communityEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="comments" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="reactions" 
                    stroke="#82ca9d" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Tasks */}
        <Grid item xs={12} lg={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardHeader title="Admin Tasks" />
            <CardContent>
              {[
                { label: "Approve Members", status: "pending" },
                { label: "Review Offers", status: "urgent" },
                { label: "Update Guidelines", status: "in-progress" }
              ].map((task, index) => (
                <Box 
                  key={index} 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="space-between" 
                  sx={{ mb: 2 }}
                >
                  <Typography>{task.label}</Typography>
                  <Chip 
                    label={task.status} 
                    color={
                      task.status === "urgent" ? "error" : 
                      task.status === "in-progress" ? "warning" : "default"
                    } 
                    size="small" 
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;