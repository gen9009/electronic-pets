(
  function () {
    import('@electron/remote').then(({ getCurrentWindow }) => {
      let win = getCurrentWindow();
      window.addEventListener("mousemove", event => {
        let flag = event.target === document.documentElement;
        if (flag) {
          win.setIgnoreMouseEvents(true, { forward: true });
        }
        else {
          win.setIgnoreMouseEvents(false);
        }
      });
      win.setIgnoreMouseEvents(true, { forward: true });
    })
  }
)()
