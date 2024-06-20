import React, { useState } from "react";
import {
  reactExtension,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry point for the extension
export default reactExtension("purchase.checkout.block.render", () => <App />);

function App() {
  // Define the metafield namespace and key
  const METAFIELDNAMESPACE = "";
  const METAFIELDKEY = "";

  // Get a reference to the metafield
  const poNumber = useMetafield({
    namespace: METAFIELDNAMESPACE,
    key: METAFIELDKEY,
  });

  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Render the extension components
  return (
    <BlockStack>
        <TextField
          label="PO Number"
          onChange={(value) => {
            // Apply the change to the metafield
            applyMetafieldsChange({
              type: "updateMetafield",
              namespace: METAFIELDNAMESPACE,
              key: METAFIELDKEY,
              valueType: "string",
              value,
            });
          }}
          value={poNumber?.value}
        />
    </BlockStack>
  );
}