import { Autocomplete, TextField, Chip } from "@mui/material";

export default function TagsAutocomplete() {
  return (
    <Autocomplete
      multiple
      id="tags-filled"
      fullWidth
      options={items.map(option => option)}
      defaultValue={[items[0]]}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip size="small" variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
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
  );
}

const items = [
  "bouffe",
  "manger",
  "biere",
  "velo",
];

