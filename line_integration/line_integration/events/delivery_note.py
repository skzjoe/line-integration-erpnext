import frappe

from line_integration.utils.line_client import get_settings, push_message


def send_line_notification(doc, method=None):
    try:
        if not doc.customer:
            return
        settings = get_settings()
        if not getattr(settings, "enable_delivery_note_notify", False):
            return

        message_tmpl = settings.delivery_note_message or "Your order {dn} has been submitted."
        text = message_tmpl.format(dn=doc.name)

        profiles = frappe.get_all(
            "LINE Profile", filters={"customer": doc.customer, "status": "Active"}, fields=["line_user_id"]
        )
        fallback_user_id = frappe.db.get_value("Customer", doc.customer, "custom_line_user_id")

        sent = False
        for p in profiles:
            if push_message(p.line_user_id, text):
                sent = True
        if not sent and fallback_user_id:
            push_message(fallback_user_id, text)
    except Exception:
        frappe.log_error(frappe.get_traceback(), "Delivery Note LINE Notification")
