import { capitalCase } from 'change-case'
import { Link as RouterLink } from 'react-router-dom'
// @mui
import { styled } from '@mui/material/styles'
import { Box, Stack, Link, Tooltip, Container, Typography, Card } from '@mui/material'
// routes
import { PATH_AUTH } from '../../routes/paths'
// hooks
import useAuth from '../../hooks/useAuth'
import useResponsive from '../../hooks/useResponsive'
// components
import Page from '../../components/Page'
// import Logo from '../../components/Logo';
import Image from '../../components/Image'
// sections
import { LoginForm } from '../../sections/auth/login'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}))

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7)
  }
}))

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}))

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0)
}))

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuth()

  const smUp = useResponsive('up', 'sm')

  const mdUp = useResponsive('up', 'md')

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <Image visibleByDefault disabledEffect src="/assets/illustrations/illustration_login.png" alt="login" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Sign in
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
              </Box>
            </Stack>

            <LoginForm />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                  Get started
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  )
}
// import { useState } from 'react';
// import useAuth from '../../hooks/useAuth';
// import { Link as RouterLink } from 'react-router-dom';
// // @mui
// import { styled } from '@mui/material/styles';
// import {
//   Box,
//   Card,
//   Stack,
//   Link,
//   Container,
//   Typography,
//   TextField,
//   IconButton,
//   InputAdornment,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Grid,
//   Paper,
//   useTheme,
//   CircularProgress,
// } from '@mui/material';
// // icons
// import SecurityIcon from '@mui/icons-material/Security';
// import LockIcon from '@mui/icons-material/Lock';
// import EmailIcon from '@mui/icons-material/Email';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import ShieldIcon from '@mui/icons-material/Shield';
// import MonitorIcon from '@mui/icons-material/Monitor';

// // ----------------------------------------------------------------------

// const RootStyle = styled('div')(({ theme }) => ({
//   minHeight: '100vh',
//   background: 'linear-gradient(45deg, #000000 30%, #1a237e 90%)',
//   position: 'relative',
//   overflow: 'hidden',
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 50%)',
//     animation: 'pulse 4s infinite',
//   },
// }));

// const HeaderStyle = styled('header')(({ theme }) => ({
//   top: 0,
//   zIndex: 9,
//   lineHeight: 0,
//   width: '100%',
//   display: 'flex',
//   alignItems: 'center',
//   position: 'absolute',
//   padding: theme.spacing(3),
//   justifyContent: 'flex-start',
//   [theme.breakpoints.up('md')]: {
//     padding: theme.spacing(7, 5, 0, 7),
//   },
// }));

// const GlowingCard = styled(Card)(({ theme }) => ({
//   background: 'rgba(18, 18, 18, 0.8)',
//   backdropFilter: 'blur(10px)',
//   border: '1px solid rgba(255, 255, 255, 0.1)',
//   boxShadow: '0 0 20px rgba(25, 118, 210, 0.2)',
//   position: 'relative',
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderRadius: theme.shape.borderRadius,
//     padding: '2px',
//     background: 'linear-gradient(45deg, #1976d2, #303f9f)',
//     mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
//     maskComposite: 'exclude',
//     pointerEvents: 'none',
//   },
// }));

// const StatsCard = styled(Paper)(({ theme }) => ({
//   background: 'rgba(25, 118, 210, 0.1)',
//   padding: theme.spacing(2),
//   textAlign: 'center',
//   border: '1px solid rgba(25, 118, 210, 0.2)',
//   borderRadius: theme.shape.borderRadius,
// }));

// // ----------------------------------------------------------------------

// export default function Login() {
//   const theme = useTheme();
//   const { login } = useAuth(); // Use the login function from useAuth hook.
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       await login(email, password);
//       console.log('Login successful');
//       // Redirect or take appropriate action on successful login
//     } catch (err) {
//       setError(err.message || 'Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <RootStyle>
//       <HeaderStyle>
//         <SecurityIcon sx={{ width: 40, height: 40, color: 'primary.main', mr: 2 }} />
//         <Typography variant="h4" sx={{ color: 'white' }}>
//           Threatactix Admin Portal
//         </Typography>
//       </HeaderStyle>

//       <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
//         <Grid container spacing={4} alignItems="center" sx={{ minHeight: '100vh', py: 15 }}>
//           <Grid sx={{ paddingRight: '20px' }} item xs={12} md={6}>
//             <div style={{ width: '95%' }}>
//               <Stack spacing={4}>
//                 <Box>
//                   <Typography variant="h3" sx={{ color: 'white', mb: 2 }}>
//                     Welcome to Command Center
//                   </Typography>
//                   <Typography variant="h6" sx={{ color: 'grey.400' }}>
//                     Access your security dashboard with enhanced protection and real-time monitoring capabilities.
//                   </Typography>
//                 </Box>

//                 <Grid container spacing={2}>
//                   <Grid item xs={6}>
//                     <StatsCard>
//                       <ShieldIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
//                       <Typography variant="h4" sx={{ color: 'primary.main' }}>
//                         99.9%
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: 'grey.500' }}>
//                         Security Rating
//                       </Typography>
//                     </StatsCard>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <StatsCard>
//                       <MonitorIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
//                       <Typography variant="h4" sx={{ color: 'primary.main' }}>
//                         24/7
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: 'grey.500' }}>
//                         Active Monitoring
//                       </Typography>
//                     </StatsCard>
//                   </Grid>
//                 </Grid>
//               </Stack>
//             </div>
//           </Grid>

//           <Grid item sx={{ paddingLeft: '20px' }} xs={12} md={6}>
//             <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
//               <GlowingCard sx={{ p: 4, width: '95%' }}>
//                 <form onSubmit={handleSubmit}>
//                   <Stack spacing={4}>
//                     <Box sx={{ textAlign: 'center' }}>
//                       <LockIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
//                       <Typography variant="h4" sx={{ color: 'white' }}>
//                         Secure Access
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: 'grey.500', mt: 1 }}>
//                         Enter your credentials to continue
//                       </Typography>
//                     </Box>

//                     {error && (
//                       <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center' }}>
//                         {error}
//                       </Typography>
//                     )}

//                     <TextField
//                       fullWidth
//                       autoComplete="username"
//                       type="email"
//                       label="Email Address"
//                       value={email}
//                       sx={{ color: 'white' }}
//                       onChange={(e) => setEmail(e.target.value)}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <EmailIcon sx={{ color: 'text.secondary' }} />
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     <TextField
//                       fullWidth
//                       autoComplete="current-password"
//                       type={showPassword ? 'text' : 'password'}
//                       label="Password"
//                       value={password}
//                       sx={{ color: 'white' }}
//                       onChange={(e) => setPassword(e.target.value)}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <LockIcon sx={{ color: 'text.secondary' }} />
//                           </InputAdornment>
//                         ),
//                         endAdornment: (
//                           <InputAdornment position="end">
//                             <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                               {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                             </IconButton>
//                           </InputAdornment>
//                         ),
//                       }}
//                     />

//                     <Stack direction="row" alignItems="center" justifyContent="space-between">
//                       <FormControlLabel
//                         control={<Checkbox sx={{ color: 'grey.500' }} />}
//                         label={<Typography sx={{ color: 'grey.500' }}>Remember me</Typography>}
//                       />
//                       <Link component={RouterLink} variant="subtitle2" to="#" sx={{ color: 'primary.main' }}>
//                         Forgot password?
//                       </Link>
//                     </Stack>

//                     <Button
//                       fullWidth
//                       size="large"
//                       variant="contained"
//                       type="submit"
//                       disabled={isLoading}
//                       sx={{
//                         background: 'linear-gradient(45deg, #1976d2 30%, #303f9f 90%)',
//                         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
//                       }}
//                     >
//                       {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
//                     </Button>
//                   </Stack>
//                 </form>
//               </GlowingCard>
//             </div>
//           </Grid>
//         </Grid>
//       </Container>
//     </RootStyle>
//   );
// }
