frappe.listview_settings["Sales Order"] = {
	onload(listview) {
		listview.page.add_menu_item(__("Copy Pending Items"), () => {
			frappe.call({
				method: "line_integration.api.quick_pay.get_pending_order_items",
			}).then((r) => {
				if (r.message) {
					frappe.utils.copy_to_clipboard(r.message);
					frappe.show_alert({ message: __("Pending items copied"), indicator: "green" });
				} else {
					frappe.show_alert({ message: __("No pending items"), indicator: "orange" });
				}
			});
		});
	},
	get_indicator(doc) {
		// Show functional status instead of docstatus badge
		const status = doc.status || "";
		if (doc.docstatus === 0) {
			return [__("Draft"), "red", "docstatus,=,0"];
		}
		if (doc.docstatus === 2) {
			return [__("Cancelled"), "red", "docstatus,=,2"];
		}
		if (status === "Completed") {
			return [__("Completed"), "green", "status,=,Completed"];
		}
		if (status === "To Deliver and Bill") {
			return [__("To Deliver and Bill"), "orange", "status,=,To Deliver and Bill"];
		}
		if (status === "To Deliver") {
			return [__("To Deliver"), "orange", "status,=,To Deliver"];
		}
		if (status === "To Bill") {
			return [__("To Bill"), "orange", "status,=,To Bill"];
		}
		if (status === "Closed") {
			return [__("Closed"), "grey", "status,=,Closed"];
		}
		// Fallback to docstatus badge
		return [__("Submitted"), "blue", "docstatus,=,1"];
	},
};
