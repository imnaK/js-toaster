class Toaster {
  #toasterId;
  #toasts;

  constructor(parentElement = document.body, defaultTimeout) {
    this.defaultTimeout = defaultTimeout > 0 ? defaultTimeout : 10000;
    this.#toasterId = this.#getUUIDv4();
    this.#toasts = {};

    this.#initToaster(parentElement);
  }

  #getUUIDv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  #initToaster(parentElement) {
    this.toasterElemenet = document.createElement("div");
    this.toasterElemenet.id = this.#toasterId;
    this.toasterElemenet.classList.add("toaster");
    parentElement.appendChild(this.toasterElemenet);
  }

  getToasterId() {
    return this.#toasterId;
  }

  getToasts() {
    return this.#toasts;
  }

  addToast(message, timeout = this.defaultTimeout) {
    const toastId = this.#getUUIDv4();
    this.#toasts[toastId] = message;
    setTimeout(() => {
      this.removeToast(toastId);
    }, timeout > 0 ? timeout : this.defaultTimeout);
    this.updateToasts();
  }

  removeToast(toastId) {
    if (!this.#toasts.hasOwnProperty(toastId)) return;
    delete this.#toasts[toastId];
    this.updateToasts();
  }

  // TODO: only remove/add necessary toasts for better performance
  updateToasts() {
    // remove all toasts
    while (this.toasterElemenet.firstChild)
      this.toasterElemenet.removeChild(this.toasterElemenet.firstChild);

    // add all toasts
    for (const [key, value] of Object.entries(this.#toasts)) {
      let toastElemenet = document.createElement("div");
      toastElemenet.id = key;
      toastElemenet.classList.add("toast");
      toastElemenet.textContent = value;
      this.toasterElemenet.prepend(toastElemenet);
    }
  }
}

