import { CreditCard, Receipt, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAuthStore } from "../stores/authStore";

export default function LandlordBilling() {
  const { user } = useAuthStore();

  const handleManagePayments = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/payments/create-portal-session/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
    }
  };

  return (
    <div className="h-full overflow-y-auto w-full bg-[#fbfbfb]">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-900">Billing & Payments</h1>
            <p className="text-stone-500 mt-2">
              Manage your subscriptions, payment methods, and view invoices.
            </p>
          </div>
          <Button
            onClick={handleManagePayments}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm"
          >
            <ExternalLink size={16} className="mr-2" />
            Manage on Stripe
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-stone-100 shadow-sm transition-all hover:border-stone-200 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-display font-bold text-stone-500 uppercase tracking-[0.2em]">Active Subscriptions</p>
                  <h3 className="text-3xl font-serif font-bold text-stone-900 mt-1">0</h3>
                </div>
                <div className="p-4 rounded-2xl bg-green-50 text-green-600 transition-transform duration-500 group-hover:scale-110">
                  <CreditCard size={28} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-100 shadow-sm transition-all hover:border-stone-200 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-display font-bold text-stone-500 uppercase tracking-[0.2em]">Monthly Total</p>
                  <h3 className="text-3xl font-serif font-bold text-stone-900 mt-1">$0</h3>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 transition-transform duration-500 group-hover:scale-110">
                  <DollarSign size={28} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-stone-100 shadow-sm transition-all hover:border-stone-200 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-display font-bold text-stone-500 uppercase tracking-[0.2em]">Next Billing</p>
                  <h3 className="text-3xl font-serif font-bold text-stone-900 mt-1">—</h3>
                </div>
                <div className="p-4 rounded-2xl bg-orange-50 text-orange-600 transition-transform duration-500 group-hover:scale-110">
                  <Calendar size={28} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card className="border-stone-100 shadow-sm">
          <CardHeader className="border-b border-stone-100 bg-white/50 backdrop-blur-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-stone-900">Payment Methods</h2>
              <Button variant="outline" size="sm" onClick={handleManagePayments} className="text-stone-600">
                <CreditCard size={14} className="mr-2" />
                Add Method
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-stone-400" />
              </div>
              <p className="text-stone-500 text-sm">
                Manage your payment methods through Stripe's secure portal.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="border-stone-100 shadow-sm">
          <CardHeader className="border-b border-stone-100 bg-white/50 backdrop-blur-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-stone-900">Recent Invoices</h2>
              <Button variant="outline" size="sm" onClick={handleManagePayments} className="text-stone-600">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <Receipt className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-2">No invoices yet</h3>
              <p className="text-stone-500 text-sm max-w-md">
                When you subscribe to list properties, your invoices will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
