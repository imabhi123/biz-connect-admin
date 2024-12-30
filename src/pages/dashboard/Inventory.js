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

import InventoryPage from "src/components/inventory/InventoryPage";
import ItemPage from "src/components/inventory/ItemPage";
import { useParams } from "react-router-dom";

// ----------------------------------------------------------------------

export default function Warehouse() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const { ItemId } = useParams();

  return (
    <Page title="Inventory">
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading="Inventory"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Inventory", href: PATH_DASHBOARD.general.inventory },
            { name: ItemId || "" },
          ]}
        />
        {ItemId ? <ItemPage item_id={ItemId} /> : <InventoryPage />}
      </Container>
    </Page>
  );
}
