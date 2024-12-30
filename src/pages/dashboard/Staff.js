import { Container, Grid } from "@mui/material";
import useSettings from "../../hooks/useSettings";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// hooks
import useAuth from "../../hooks/useAuth";
// components
import Page from "../../components/Page";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
// sections
import UserPage from "src/components/staff/User";
import RolePage from "src/components/staff/Role";
// ----------------------------------------------------------------------

export default function Staff() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  return (
    <Page title="Staff">
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading="Staff"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Staff", href: PATH_DASHBOARD.user.staff },
            { name: user?.displayName || "" },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={9}>
            <UserPage />
          </Grid>

          <Grid item xs={12} sm={12} md={3}>
            <RolePage />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
