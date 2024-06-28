# JavaScript Toaster

This repository contains the Toaster class, a JavaScript system for displaying short, informative messages, commonly known as "toasts", to the user. The Toaster class provides a variety of methods for managing these toasts, such as adding and removing them. The toasts are displayed on a web page and are automatically removed after a specified timeout.

## Usage

To use the Toaster class, create a new instance and provide an HTML element where the toasts should be displayed. You can also provide an options object for further customization.

Both parameters are optional. If none are passed the Toaster will use `document.body` as its parent along with default options.

```javascript
const toaster = new Toaster(document.body, {
  defaultTimeout: 5000,
  toasterPrefix: 'my-toaster-',
  toastPrefix: 'my-toast-',
});
```

To display a toast, simply call the `addToast` method with the desired message and timeout (optional).

```javascript
toaster.addToast('Hello, world!', 3000);
```

## Examples

For more detailed examples on how to use the Toaster class, check out the `examples/` directory in this repository. These examples cover a range of use cases and demonstrate how to fully utilize the features of the Toaster class.

## Contributing

If you have suggestions for how the Toaster class could be improved, or want to report a bug, open an issue! I'd love all and any contributions.

## License

[MIT](LICENSE) © Adrian Batlle Heger
