export function initPublications() {
  const search = document.querySelector("#publication-search");
  if (!search) return;

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const wishlist = new Set();
  let selected = "";
  let opener;

  const cta = $("#wishlist-cta");
  const contactBase = (cta?.getAttribute("href") || "../contact/").split("?")[0];

  function updateWishlist() {
    $("#wishlist-count").textContent = `${wishlist.size} publication${wishlist.size === 1 ? "" : "s"} on your wishlist`;
    if (cta) {
      cta.href =
        contactBase +
        "?" +
        new URLSearchParams({ publications: [...wishlist].join(", ") });
    }
    const add = $("#wishlist-add");
    if (add) {
      add.textContent = wishlist.has(selected)
        ? "Remove from wishlist −"
        : "Add to wishlist ↗";
    }
  }

  const cards = $$(".publication-card");
  const filter = () => {
    let count = 0;
    cards.forEach((c) => {
      c.hidden = !(
        c.dataset.name
          .toLowerCase()
          .includes($("#publication-search").value.toLowerCase().trim()) &&
        ($("#publication-category").value === "All categories" ||
          c.dataset.category === $("#publication-category").value) &&
        ($("#publication-region").value === "All regions" ||
          c.dataset.region === $("#publication-region").value)
      );
      if (!c.hidden) count++;
    });
    $("#publication-count").textContent = `${count} publication targets`;
    $("#publication-empty").hidden = count > 0;
  };

  $$("#publication-search, #publication-category, #publication-region").forEach(
    (el) => el.addEventListener("input", filter)
  );
  filter();

  cards.forEach((c) =>
    c.addEventListener("click", () => {
      selected = c.dataset.name;
      opener = c;
      $("#dialog-title").textContent = selected;
      $("#dialog-category").textContent =
        c.dataset.category + " / " + c.dataset.region;
      updateWishlist();
      $("#publication-dialog").showModal();
    })
  );

  $("#dialog-close").addEventListener("click", () =>
    $("#publication-dialog").close()
  );
  $("#publication-dialog").addEventListener("close", () => opener?.focus());
  $("#wishlist-add").addEventListener("click", () => {
    wishlist.has(selected) ? wishlist.delete(selected) : wishlist.add(selected);
    updateWishlist();
  });
}
