import React, { useState } from "react";
import {
  useApi,
  useTranslate,
  reactExtension,
  useApplyMetafieldsChange,
  useMetafield,
  DatePicker,
  BlockStack,
} from '@shopify/ui-extensions-react/checkout';

// Set the entry point for the extension
export default reactExtension("purchase.checkout.block.render", () => <App />);

// Function that formats dates they way they need to be stored in metafields
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Find the next date that should be selectable by the buyer
function getNextAvailableDate(disabledDateRanges) {
  const lastDisabledDate = disabledDateRanges.reduce((maxDate, range) => {
    const endDate = new Date(range.end);
    return endDate > maxDate ? endDate : maxDate;
  }, new Date(disabledDateRanges[0].end));

  const nextAvailableDate = new Date(lastDisabledDate);
  nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
  return formatDate(nextAvailableDate);
}

function App() {
  // Define the metafield namespace and key
  const METAFIELDNAMESPACE = "";
  const METAFIELDKEY = "";

  // Get a reference to the metafield
  const deliveryDate = useMetafield({
    namespace: METAFIELDNAMESPACE,
    key: METAFIELDKEY,
  });

  // Make X days into the future unselectable, here X=1
  // TODO handle weekends differently.
  // TODO handle holidays differently.
  const currentDate = new Date();
  const twoDaysFromNow = new Date(currentDate);
  twoDaysFromNow.setDate(currentDate.getDate() + 1);

  // Make all past dates unselectable, up to X days from now as set above
  const disableDateRanges = [
    {
      start: "0001-01-01", // Minimum possible date
      end: formatDate(twoDaysFromNow),
    },
  ];

  // Set states
  const initialSelectedDate = getNextAvailableDate(disableDateRanges);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  
  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  const translate = useTranslate();
  const { extension } = useApi();


  const handleDateChange = (newSelectedDate) => {
    setSelectedDate(newSelectedDate);
    applyMetafieldsChange({
      type: "updateMetafield",
      namespace: METAFIELDNAMESPACE,
      key: METAFIELDKEY,
      valueType: "string",
      value: newSelectedDate,
    });
  };

  return (
    <BlockStack>
      <DatePicker
        label={translate("Delivery Date")}
        selected={selectedDate}
        onChange={handleDateChange}
        disabled={disableDateRanges}
      />
    </BlockStack>
  );
}