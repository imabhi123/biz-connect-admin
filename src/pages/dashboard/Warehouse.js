import { Container } from "@mui/material";
import useSettings from "../../hooks/useSettings";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// hooks
import useAuth from "../../hooks/useAuth";
// components
import Page from "../../components/Page";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
// sections

import WarehousePage from "src/components/warehouse/Warehouse";
// ----------------------------------------------------------------------

export default function Warehouse() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  return (
    <Page title="Hello-Biz">
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading="Hello-Biz"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Threats", href: PATH_DASHBOARD.general.warehouse },
            { name: user?.displayName || "" },
          ]}
        />
        <WarehousePage />
      </Container>
    </Page>
  );
}
