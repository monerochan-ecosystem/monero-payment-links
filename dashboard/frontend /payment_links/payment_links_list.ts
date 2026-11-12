import { html, type MiniHtmlString } from "@spirobel/mininext";
import { router } from "../dashboard_router";
import { formatLinkAmountDisplay } from "../../../rates";
import { copyButton } from "../form_kit";

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
      ${copyButton(paymentUrl)}
    </a>`;
  };

  return html`<div>
    ${paymentLinks.length > 0
      ? html`<div class="payment-links-header">
          <h1>Payment Links</h1>
        </div>`
      : ""}
    <div class="payment-links-list">${paymentLinks.map(renderPaymentLink)}</div>
  </div>`;
}
