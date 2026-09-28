import { html, flatten, type MiniHtmlString } from "@spirobel/mininext";
import { router } from "../dashboard_router";
import { formatLinkAmountDisplay } from "../../../rates";

export function paymentLinksList() {
  const paymentLinks = window.dashboardData.payment_links || [];

  const renderPaymentLink = (link: any) => {
    const isProduct = link.linkType === "product";
    const badgeClass = isProduct ? "product-badge" : "invoice-badge";
    const badgeText = isProduct ? "Product" : "Invoice";
    const amount = formatLinkAmountDisplay(link);
    const title = link.title || "Untitled";

    const linkUrl = router.link("/payment-links/:id", {
      id: link.payment_link_id,
    });

    let detailsHtml: MiniHtmlString;
    if (isProduct) {
      const paymentCount = link.currentUses || 0;
      detailsHtml = html`<div class="payment-link-details">
        <span>${amount}</span>
        <span>•</span>
        <span
          >${paymentCount} payment${paymentCount !== 1 ? "s" : ""}
          received</span
        >
      </div>`;
    } else {
      // invoice: show payment status or due date
      const isPaid = (link.currentUses || 0) >= 1;
      if (isPaid) {
        detailsHtml = html`<div class="payment-link-details">
          <span>${amount}</span>
          <span>•</span>
          <span>Payment received</span>
        </div>`;
      } else {
        const dueDateText = link.dueDate
          ? `Due on ${new Date(link.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`
          : "No due date";
        detailsHtml = html`<div class="payment-link-details">
          <span>${amount}</span>
          <span>•</span>
          <span>${dueDateText}</span>
        </div>`;
      }
    }

    const paymentUrl = `${location.origin}/pay/${link.payment_link_id}`;
    return html`<a class="payment-link-card" href="${linkUrl}">
      <div class="payment-link-info">
        <h3>${title} <span class="${badgeClass}">${badgeText}</span></h3>
        <p class="payment-link-url">${paymentUrl}</p>
        ${detailsHtml}
      </div>
      <button
        class="copy-link-btn"
        onclick="event.preventDefault(); const btn=this; const original=btn.innerHTML; navigator.clipboard.writeText('${paymentUrl}'); btn.textContent='Copied!'; setTimeout(() => { btn.innerHTML=original; }, 2000);"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          ></path>
        </svg>
      </button>
    </a>`;
  };

  return html`<div>
    ${paymentLinks.length > 0
      ? html`<div class="payment-links-header">
          <h1>Payment Links</h1>
        </div>`
      : ""}
    ${() => {
      const linkElementList: MiniHtmlString[] = [];
      for (const link of paymentLinks) {
        linkElementList.push(renderPaymentLink(link));
      }
      return flatten(
        linkElementList,
        (l) => html`<div class="payment-links-list">${l}</div>`,
      );
    }}
  </div>`;
}
