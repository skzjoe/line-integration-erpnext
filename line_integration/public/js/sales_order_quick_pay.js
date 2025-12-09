frappe.ui.form.on("Sales Order", {
	refresh(frm) {
		if (frm.doc.docstatus !== 1 || frm.doc.status === "Closed") {
			return;
		}
		frm.add_custom_button(
			__("Quick Pay"),
			() => quickPay(frm),
			__("Line Integration")
		);
		frm.add_custom_button(
			__("Request Payment"),
			() => requestPayment(frm),
			__("Line Integration")
		);
		frm.add_custom_button(
			__("Copy Order Text"),
			() => copyOrderText(frm),
			__("Line Integration")
		);
		frm.add_custom_button(
			__("Print Bag Label"),
			() => printBagLabel(frm),
			__("Line Integration")
		);
	},
});

function quickPay(frm) {
	frappe.call({
		method: "line_integration.api.quick_pay.quick_pay_sales_order",
		freeze: true,
		freeze_message: __("Creating Invoice and Payment..."),
		args: { sales_order: frm.doc.name },
	}).then((r) => {
		if (r.message) {
			frappe.msgprint({
				title: __("Quick Pay"),
				indicator: "green",
				message: r.message,
			});
			frm.reload_doc();
		}
	});
}

function requestPayment(frm) {
	frappe.call({
		method: "line_integration.api.quick_pay.request_payment",
		freeze: true,
		freeze_message: __("Sending payment request..."),
		args: { sales_order: frm.doc.name },
	}).then((r) => {
		if (r.message) {
			frappe.msgprint({
				title: __("Request Payment"),
				indicator: "green",
				message: r.message,
			});
		}
	});
}

function printBagLabel(frm) {
	const w = window.open(frappe.urllib.get_full_url(`/api/method/line_integration.api.quick_pay.print_bag_label?sales_order=${encodeURIComponent(frm.doc.name)}`));
	if (!w) {
		frappe.msgprint({ indicator: "orange", message: __("Please allow popups to print.") });
	}
}

function copyOrderText(frm) {
	frappe.call({
		method: "line_integration.api.quick_pay.get_order_copy_text",
		args: { sales_order: frm.doc.name },
	}).then((r) => {
		if (r.message) {
			frappe.utils.copy_to_clipboard(r.message);
			frappe.show_alert({ message: __("Order text copied"), indicator: "green" });
		}
	});
}
