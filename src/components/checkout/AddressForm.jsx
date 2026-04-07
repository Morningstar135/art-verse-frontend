import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
};

const headerStyle = {
  fontFamily: 'var(--font-display, serif)',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: '8px',
};

function AddressForm({ onSubmit, initialValues }) {
  const [values, setValues] = useState({
    label: initialValues?.label || '',
    line1: initialValues?.line1 || '',
    line2: initialValues?.line2 || '',
    city: initialValues?.city || '',
    state: initialValues?.state || '',
    pincode: initialValues?.pincode || '',
    phone: initialValues?.phone || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!values.line1.trim()) {
      newErrors.line1 = 'Address line 1 is required';
    }

    if (!values.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!values.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!values.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(values.pincode.trim())) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }

    if (!values.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(values.phone.trim())) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      label: values.label.trim(),
      line1: values.line1.trim(),
      line2: values.line2.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      pincode: values.pincode.trim(),
      phone: values.phone.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={headerStyle}>Shipping Address</h3>

      <Input
        label="Label"
        name="label"
        value={values.label}
        onChange={handleChange}
        placeholder="e.g. Home, Office"
        error={errors.label}
      />

      <Input
        label="Address Line 1"
        name="line1"
        value={values.line1}
        onChange={handleChange}
        placeholder="Street address, building name"
        required
        error={errors.line1}
      />

      <Input
        label="Address Line 2"
        name="line2"
        value={values.line2}
        onChange={handleChange}
        placeholder="Apartment, floor, etc. (optional)"
        error={errors.line2}
      />

      <div style={rowStyle}>
        <Input
          label="City"
          name="city"
          value={values.city}
          onChange={handleChange}
          placeholder="City"
          required
          error={errors.city}
        />

        <Input
          label="State"
          name="state"
          value={values.state}
          onChange={handleChange}
          placeholder="State"
          required
          error={errors.state}
        />
      </div>

      <div style={rowStyle}>
        <Input
          label="Pincode"
          name="pincode"
          value={values.pincode}
          onChange={handleChange}
          placeholder="6-digit pincode"
          required
          error={errors.pincode}
        />

        <Input
          label="Phone"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          placeholder="10-digit phone number"
          required
          error={errors.phone}
        />
      </div>

      <Button type="submit" variant="primary" fullWidth>
        Continue to Review
      </Button>
    </form>
  );
}

export default AddressForm;
