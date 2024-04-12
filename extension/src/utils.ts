export function getRootElement() {
  // guaranteed after main render
  return document
    .getElementById('<your_extension_name>-host')!
    .shadowRoot!.getElementById('<your_extension_name>')!
}
