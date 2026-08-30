"use client";

import {
  AppCheckbox,
  AppCombobox,
  AppCurrencyInput,
  AppDatePicker,
  AppField,
  AppFileUpload,
  AppInput,
  AppMultiSelect,
  AppNumberInput,
  AppRadioGroup,
  AppRangeSlider,
  AppSelect,
  AppSwitch,
  AppTextarea,
  AppTimePicker,
} from "@/components/app-ui";
import { useState } from "react";

export function FormControlsSection() {
  const [inputValue, setInputValue] = useState("");
  const [currencyVal, setCurrencyVal] = useState(150.0);
  const [switchVal, setSwitchVal] = useState(true);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState("card");
  const [sliderVal, setSliderVal] = useState(50);
  const [selectVal, setSelectVal] = useState("usd");
  const [multiSelectVal, setMultiSelectVal] = useState(["groceries"]);
  const [comboboxVal, setComboboxVal] = useState("bKash");
  const [dateVal, setDateVal] = useState<Date | undefined>(new Date());
  const [timeVal, setTimeVal] = useState("14:30");

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {/* Inputs & Fields */}
      <div className="scroll-mt-6 space-y-6" id="inputs-fields">
        <h3 className="text-lg font-semibold">Inputs & Fields</h3>

        <AppField description="Enter your primary email address." label="Email Address">
          <AppInput
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="user@example.com"
            value={inputValue}
          />
        </AppField>

        <AppField label="Currency Input (USD)">
          <AppCurrencyInput
            currency="USD"
            onChange={(e) => setCurrencyVal(Number(e.target.value) || 0)}
            value={currencyVal}
          />
        </AppField>

        <AppField label="Number Input">
          <AppNumberInput min={1} onValueChange={() => {}} value={5} />
        </AppField>

        <AppField label="Textarea">
          <AppTextarea placeholder="Add optional transaction notes..." rows={3} />
        </AppField>
      </div>

      {/* Selects & Multi-Selects */}
      <div className="scroll-mt-6 space-y-6" id="selects-pickers">
        <h3 className="text-lg font-semibold">Selects & Pickers</h3>

        <AppField label="Select Currency">
          <AppSelect
            onValueChange={(val) => setSelectVal(val ?? "usd")}
            options={[
              { label: "USD ($)", value: "usd" },
              { label: "EUR (€)", value: "eur" },
              { label: "BDT (৳)", value: "bdt" },
            ]}
            value={selectVal}
          />
        </AppField>

        <AppField label="Combobox (Wallet Search)">
          <AppCombobox
            onValueChange={(val) => setComboboxVal(val ?? "bKash")}
            options={[
              { label: "bKash Account", value: "bKash" },
              { label: "BRAC Bank Savings", value: "brac" },
              { label: "Cash Wallet", value: "cash" },
            ]}
            placeholder="Select a wallet..."
            value={comboboxVal}
          />
        </AppField>

        <AppField label="Multi-Select Categories">
          <AppMultiSelect
            onValueChange={setMultiSelectVal}
            options={[
              { label: "Groceries", value: "groceries" },
              { label: "Utilities", value: "utilities" },
              { label: "Dining Out", value: "dining" },
            ]}
            value={multiSelectVal}
          />
        </AppField>

        <AppField label="Date Picker">
          <AppDatePicker onValueChange={setDateVal} value={dateVal} />
        </AppField>

        <AppField label="Time Picker">
          <AppTimePicker onValueChange={(val) => setTimeVal(val ?? "14:30")} value={timeVal} />
        </AppField>
      </div>

      {/* Toggles, Checkboxes & Sliders */}
      <div className="scroll-mt-6 space-y-6 sm:col-span-2" id="toggles-controls">
        <h3 className="text-lg font-semibold">Toggles & Controls</h3>
        <div className="grid gap-6 rounded-lg border border-border bg-card p-6 sm:grid-cols-3">
          <div className="flex items-center justify-between gap-4">
            <AppSwitch
              checked={switchVal}
              label="Enable Notifications"
              onCheckedChange={setSwitchVal}
            />
          </div>

          <div className="flex items-center gap-3">
            <AppCheckbox
              checked={checkboxVal}
              label="Remember Preference"
              onCheckedChange={setCheckboxVal}
            />
          </div>

          <div className="space-y-2">
            <AppRangeSlider
              label={`Budget Limit (${sliderVal}%)`}
              max={100}
              min={0}
              onValueChange={setSliderVal}
              value={sliderVal}
            />
          </div>
        </div>

        <AppField label="Payment Method">
          <AppRadioGroup
            onValueChange={(val) => setRadioVal(val ?? "card")}
            options={[
              { label: "Credit/Debit Card", value: "card" },
              { label: "Mobile Wallet (bKash/Nagad)", value: "mfs" },
              { label: "Bank Transfer", value: "bank" },
            ]}
            value={radioVal}
          />
        </AppField>

        <AppField label="Receipt Attachment">
          <AppFileUpload onFiles={() => {}} />
        </AppField>
      </div>
    </div>
  );
}
