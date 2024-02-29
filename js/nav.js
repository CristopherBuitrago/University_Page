const nav = document.querySelector("#nav");
const open = document.querySelector("#btnOpen");
const close = document.querySelector("#btnClose");

open.addEventListener("click", () => {
    // when pick open nav bar will be visible.
    nav.classList.add("nav-visible");
})

close.addEventListener("click", () => {
    // when pick close nav bar will be hiddden.
    nav.classList.remove("nav-visible");
})