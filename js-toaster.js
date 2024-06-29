/**
 * Represents a Toaster, a system for displaying short messages (toasts) to a user.
 * @class
 */
class Toaster {
  #options;
  #toasterId;
  #toasts;
  #toasterElement;

  /**
   * Valid options are:
   * {
   *   defaultTimeout: number,
   *   toasterPrefix: string,
   *   toastPrefix: string,
   * }
   * where defaultTimeout is measured in milliseconds.
   * @constructor
   * @param {HTMLElement} [parentElement=document.body] - The parent HTML element where the toaster will be appended.
   * @param {Object} [options={}] - The options for initializing the Toaster. If no options are passed, it will use default options in place.
   */
  constructor(parentElement = document.body, options = {}) {
    this.#options = this.#getValidatedOptions(options);
    this.#toasterId = this.#getId(this.#options.toasterPrefix);
    this.#toasts = {};

    this.#initToaster(parentElement);
  }

  #getId(prefix) {
    return prefix + this.#getUUIDv4();
  }

  #getUUIDv4() {
    // i am not sure about this uuidv4 gen
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  /**
   * Loops over options and validates the keys and values. If options are not valid, it uses default values in place.
   * @private
   * @param {Object} options - The options object.
   * @returns {Object} - A new object with validated and filled-in options.
   */
  #getValidatedOptions(options) {
    const isPositiveNumber = (val) => typeof val === "number" && val > 0;
    const isValidId = (val) => typeof val === "string" && val.length > 0 && !/\s/.test(val);

    const defaultOptions = {
      defaultTimeout: {
        defaultValue: 10000,
        sanitization: isPositiveNumber,
      },
      toasterPrefix: {
        defaultValue: "toaster-",
        sanitization: isValidId,
      },
      toastPrefix: {
        defaultValue: "toast-",
        sanitization: isValidId,
      },
    };

    return Object.keys(defaultOptions).reduce((prev, key) => {
      const optionValue = options.hasOwnProperty(key) && defaultOptions[key].sanitization(options[key])
        ? options[key]
        : defaultOptions[key].defaultValue;
      Object.assign(prev, { [key]: optionValue });
      return prev;
    }, {});
  }

  #initToaster(parentElement) {
    this.#toasterElement = document.createElement("div");
    this.#toasterElement.id = this.#toasterId;
    this.#toasterElement.classList.add("toaster");
    parentElement.appendChild(this.#toasterElement);
  }

  /**
   * Get the current options this Toaster is running with.
   * @returns {Object} The options. E.g.: `defaultTimeout`, `toasterPrefix` and `toastPrefix` as keys.
   */
  getOptions() {
    return this.#options;
  }

  /**
   * Get the Toaster (wrapper) elements id. Does match with the DOM id.
   * @returns {string} The Toaster id as a string.
   */
  getToasterId() {
    return this.#toasterId;
  }

  /**
   * Get all current toast ids with their messages and timeouts.
   * @returns {Object} The Object with the toast ids as the keys and the values as Objects holding inner the keys `message` for the message and `timeout` holding a reference to the active waiting timeout not yet triggered.
   */
  getToasts() {
    return this.#toasts;
  }

  /**
   * Get the Toaster (wrapper) element of the toasts.
   * @returns {HTMLElement} The Toaster/Wrapper HTMLElement in the DOM.
   */
  getToasterElement() {
    return this.#toasterElement;
  }

  /**
   * Get the current count of all toasts.
   * @returns {number} The count of all toasts.
   */
  getToastCount() {
    return Object.keys(this.#toasts).length;
  }

  /**
   * Get the message of a specific toast.
   * @param {string} toastId - The id of the toast to get the message from. Does match with the DOM id.
   * @returns {string} The message as a string.
   */
  getToastMessage(toastId) {
    return this.#toasts[toastId].message;
  }

  /**
   * Get all current toast ids.
   * @returns {Array} The Array of toast ids (strings).
   */
  getAllToastIds() {
    return Object.keys(this.#toasts);
  }

  /**
   * Adds a new toast message to the Toaster.
   * @param {string} message - The message to display in the toast.
   * @param {number} [timeout=this.#options.defaultTimeout] - The time after which the toast should disappear in ms.
   * @returns {string} The id the toast was created with. Consist of the toastPrefix from options plus a generated "UUIDv4".
   */
  addToast(message, timeout = this.#options.defaultTimeout) {
    const toastId = this.#getId(this.#options.toastPrefix);
    message = String(message);

    // create the HTML toast element.
    let toastElement = document.createElement("div");
    toastElement.id = toastId;
    toastElement.classList.add("toast");
    toastElement.textContent = message;
    this.#toasterElement.prepend(toastElement);

    // Adds toastId and its message to the toasts object to keep track of it. Also sets the timeout and also puts it in the toasts object.
    this.#toasts[toastId] = {
      message: message,
      timeout: setTimeout(() => {
        this.removeToast(toastId);
      }, timeout > 0 ? timeout : this.#options.defaultTimeout),
    };

    return toastId;
  }

  /**
   * Removes a specific toast from the Toaster.
   * @param {string} toastId - The id of the toast to remove. Does match with the DOM id.
   */
  removeToast(toastId) {
    if (!this.#toasts.hasOwnProperty(toastId)) return;
    clearTimeout(this.#toasts[toastId].timeout);
    delete this.#toasts[toastId];
    this.#removeToastElement(toastId);
  }

  #removeToastElement(toastId) {
    try {
      this.#toasterElement.querySelector("#" + toastId).remove();
    } catch (error) {
      console.error("JS-Toaster Error: There is no toast with id", toastId);
    }
  }

  /**
  * Removes all toasts from the Toaster.
  */
  removeAllToasts() {
    for (const key of Object.keys(this.#toasts))
      this.removeToast(key);
  }
}

