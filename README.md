<div align="center">


  <img title="UseBase Logo" alt="UseBase Logo" width="300px" src="https://raw.githubusercontent.com/NaN-NaN-sempai/JAZZ/main/logo/logo.png" />

  <img title="UseBase Logo" alt="UseBase Logo" width="300px" src="https://raw.githubusercontent.com/NaN-NaN-sempai/JAZZ/main/logo/Sub-Logo.png" />
  <img title="UseBase Logo" alt="UseBase Logo" width="300px" src="https://raw.githubusercontent.com/NaN-NaN-sempai/JAZZ/main/logo/WaterMark.png" />

</div>

# Jazz

Jazz is an innovative styling language that extends traditional CSS with advanced programming features. It allows developers to integrate dynamic logic, called "jazz blocks," directly into their style sheets, enabling powerful event-driven style manipulation.

## Features

- **Jazz Blocks:** Introduce programming logic directly into your stylesheets with jazz blocks. These blocks empower developers to create dynamic styles based on events and interactions.

- **Selector Nesting:** Jazz supports selector nesting, making it easy to organize and structure your styles in a hierarchical manner.

- **Event Handling:** Jazz comes with an extensive set of events, providing fine-grained control over style changes triggered by user interactions or system events.

- **CSS Compatibility:** Jazz is designed to be compatible with existing CSS syntax, allowing for a smooth transition for developers familiar with traditional stylesheets.

## Example

### JAZZ
```css
.myElement:mousemove {
    jazz: {
        set x = self.event.clientX + "px";
        set y = self.event.clientY + "px";

        console.log("Mouse hovering: " + this.element.tagName + " in x: " + x + ", y: " + y);
    };

    border: 20px solid green;
    background: radial-gradient(50% at var(--x) var(--y), red, blue);

    .nestedClass {
        color: yellow;
    }
}
```
Outputs JS & CSS:
### CSS
```css
.myElement:has(.jazz-4565635414123) {
    border: 20px solid green;
    background: radial-gradient(50% at var(--x) var(--y), red, blue);
}

.myElement:has(.jazz-4565635414123) .nestedClass {
    color: yellow;
}
```
### JS
```js
[...document.querySelectorAll(".myElement:has(.jazz-4565635414123)")].forEach(element => {
    element.addEventListener("mousemove", (event) => {
        let x = event.clientX + "px";
        element.setAttribute("--x", x);
        let y = event.clientX + "px";
        element.setAttribute("--y", y);

        console.log("Mouse hovering: " + element.tagName + " in x: " + x + ", y: " + y);
    });
});
```

