import { Autocomplete, TextField, Chip } from "@mui/material";
import React from "react";

export default function TagsAutocomplete({ onChange }) {
  return (
    <Autocomplete
      multiple
      id="tags-filled"
      fullWidth
      options={items.map(option => option)}
      defaultValue={[]}
      onChange={(_, data) => onChange(data)}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => (
          <Chip size="small" variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }}
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label="Tags"
          placeholder="Tag"
        />
      )}
    />
  )
}

const items = [
  "bouffe",
  "manger",
  "biere",
  "velo",
];

