"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { analyzeTrend, createPortfolio, getPortfolioHoldings, addHolding, updateHolding, deleteHolding, refreshPortfolioPrices } from '@/lib/api';
import { HoldingModal } from "@/components/HoldingModal";

type ViewState = 'dashboard' | 'portfolio' | 'analysis' | 'settings';
type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';

const CURRENCIES: Record<CurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.78 },
  INR: { symbol: '₹', rate: 83.5 },
  JPY: { symbol: '¥', rate: 155 },
};

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [mounted, setMounted] = useState(false);

  // Portfolio State
  const [portfolioId, setPortfolioId] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatMoney = (amount: number) => {
    if (!mounted) return ""; // Avoid hydration mismatch by rendering nothing initially
    const { symbol, rate } = CURRENCIES[currency];
    const value = amount * rate;
    return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const [loadingPrices, setLoadingPrices] = useState(false);

  // Calculate Totals & P/L
  const totalInvested = holdings.reduce((sum, h) => sum + (h.quantity * h.average_price), 0);
  const currentValue = holdings.reduce((sum, h) => {
    const price = h.current_price || h.average_price; // Fallback to avg if no current
    return sum + (h.quantity * price);
  }, 0);
  const totalPL = currentValue - totalInvested;
  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  // Asset Allocation
  const allocation = holdings.reduce((acc: any, h: any) => {
    const type = h.asset_type || 'STOCK';
    const value = h.quantity * (h.current_price || h.average_price);
    acc[type] = (acc[type] || 0) + value;
    return acc;
  }, {});

  const refreshPrices = async () => {
    if (!portfolioId) return;
    setLoadingPrices(true);
    await refreshPortfolioPrices(portfolioId);
    await loadHoldings(portfolioId);
    setLoadingPrices(false);
  };

  // AI Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'agent', content: string }[]>([
    { role: 'agent', content: 'Hello! I am your Portfolio AI. Ask me about any stock!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize Portfolio
  React.useEffect(() => {
    const initPortfolio = async () => {
      let id = localStorage.getItem('portfolioId');
      if (!id) {
        const p = await createPortfolio("My Portfolio");
        if (p && p.id) {
          id = p.id;
          localStorage.setItem('portfolioId', id as string);
        } else {
          console.error("Failed to create portfolio", p);
        }
      }
      setPortfolioId(id);
      if (id) loadHoldings(id);
    };
    initPortfolio();
  }, []);

  const loadHoldings = async (id: string) => {
    const data = await getPortfolioHoldings(id);
    if (Array.isArray(data)) setHoldings(data);
  };

  const openAddModal = () => {
    setEditingHolding(null);
    setIsModalOpen(true);
  };

  const handleSaveHolding = async (holdingData: any) => {
    if (!portfolioId) return;

    // Sanitization and Type Conversion
    const payload = {
      ...holdingData,
      quantity: Number(holdingData.quantity) || 0,
      average_price: Number(holdingData.average_price) || 0,
      target_value: holdingData.target_value ? Number(holdingData.target_value) : null,
      conviction_level: holdingData.conviction_level || null,
      investment_thesis: holdingData.investment_thesis || null,
      risks: holdingData.risks || null,
      time_horizon: holdingData.time_horizon || null,
      notes: holdingData.notes || null,
    };

    if (holdingData.id) {
      // Update existing holding
      await updateHolding(holdingData.id, payload);
    } else {
      // Add new holding
      await addHolding(portfolioId, payload);
    }
    setIsModalOpen(false);
    loadHoldings(portfolioId);
  };

  const handleEdit = (h: any) => {
    setEditingHolding(h);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this investment?")) {
      await deleteHolding(id);
      loadHoldings(portfolioId!);
    }
  };

  const handleSend = async () => {
    if (!input) return;
    const msg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const ticker = msg.toUpperCase().trim().split(' ')[0];
      const result = await analyzeTrend(ticker);

      let responseText = "";
      if (result.error) {
        responseText = `Error: ${result.error}`;
      } else {
        responseText = result.analysis || JSON.stringify(result);
      }

      setMessages(prev => [...prev, { role: 'agent', content: responseText }]);

    } catch (e) {
      setMessages(prev => [...prev, { role: 'agent', content: "Something went wrong." }]);
    }
    setLoading(false);
  };

  const NavButton = ({ view, label }: { view: ViewState, label: string }) => (
    <Button
      variant="ghost"
      onClick={() => setCurrentView(view)}
      className={`w-full justify-start ${currentView === view ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
    >
      {label}
    </Button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 p-4 hidden md:block">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-8">
          Portfolio AI
        </h1>
        <nav className="space-y-2">
          <NavButton view="dashboard" label="Dashboard" />
          <NavButton view="portfolio" label="Portfolio" />
          <NavButton view="analysis" label="Analysis" />
          <NavButton view="settings" label="Settings" />
        </nav>

        <div className="mt-8 pt-8 border-t border-slate-800">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Currency</h3>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="w-full bg-slate-900 text-slate-300 text-sm rounded-md border border-slate-700 p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {Object.keys(CURRENCIES).map((c) => (
              <option key={c} value={c}>{c} ({CURRENCIES[c as CurrencyCode].symbol})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-auto">

        {/* Conditional View Rendering */}
        <div className="md:col-span-2 space-y-6">
          {currentView === 'dashboard' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <Button onClick={refreshPrices} disabled={loadingPrices} className="bg-blue-600 hover:bg-blue-500">
                  {loadingPrices ? "Refreshing..." : "↻ Refresh Prices"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-800 text-white">
                  <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Net Worth</CardTitle></CardHeader>
                  <CardContent className="text-2xl font-bold">{formatMoney(currentValue)}</CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 text-white">
                  <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Invested</CardTitle></CardHeader>
                  <CardContent className="text-2xl font-bold text-slate-300">{formatMoney(totalInvested)}</CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 text-white">
                  <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total P/L</CardTitle></CardHeader>
                  <CardContent className={`text-2xl font-bold ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {totalPL >= 0 ? '+' : ''}{formatMoney(totalPL)} ({totalPLPercent.toFixed(2)}%)
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card className="bg-slate-900 border-slate-800 text-white h-[300px]">
                  <CardHeader><CardTitle>Asset Allocation</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(allocation).filter(([_, val]: any) => val > 0).map(([type, val]: any) => {
                        const percent = (val / currentValue) * 100;
                        return (
                          <div key={type}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{type}</span>
                              <span>{percent.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 text-white h-[300px]">
                  <CardHeader><CardTitle>Top Performers</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {holdings.map((h: any) => {
                        const curr = (h.current_price || h.average_price) * h.quantity;
                        const inv = h.average_price * h.quantity;
                        const pl = curr - inv;
                        return { ...h, pl };
                      })
                        .sort((a, b) => b.pl - a.pl)
                        .slice(0, 3)
                        .map((h) => (
                          <div key={h.id} className="flex justify-between items-center border-b border-slate-800 pb-2 last:border-0">
                            <div>
                              <p className="font-bold">{h.symbol}</p>
                              <p className="text-xs text-slate-400">{h.asset_type}</p>
                            </div>
                            <div className={`font-mono ${h.pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {h.pl >= 0 ? '+' : ''}{formatMoney(h.pl)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {currentView === 'portfolio' && (
            <Card className="bg-slate-900 border-slate-800 text-white min-h-[500px]">
              <div className="flex justify-between items-center p-6 border-b border-slate-800">
                <CardTitle>Your Portfolio Holdings</CardTitle>
                <Button onClick={openAddModal} className="bg-emerald-600 hover:bg-emerald-500 gap-2">
                  <span>+</span> Add Investment
                </Button>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {holdings.length === 0 && <p className="text-slate-500 text-center py-8">No holdings yet. Click "Add Investment" to start!</p>}
                  {holdings.map((h: any) => (
                    <div key={h.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center group hover:border-slate-700 transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-900 rounded border border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400">{h.symbol.slice(0, 3)}</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{h.symbol}</span>
                            <span className="text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/50">
                              {h.asset_type?.replace('_', ' ') || 'STOCK'}
                            </span>
                          </div>
                          {(h.asset_type === 'FD' || h.asset_type === 'CHIT_FUND' || h.asset_type === 'REAL_ESTATE')
                            ? <span className="text-sm text-slate-400">Invested: {formatMoney(h.average_price)}</span>
                            : <span className="text-sm text-slate-400">{h.quantity} units @ {formatMoney(h.average_price)}</span>
                          }
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-emerald-400 font-mono font-bold text-lg">
                            {formatMoney(h.quantity * h.average_price)}
                          </div>
                          <div className="text-xs text-slate-500">Current Value</div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(h)} className="hover:bg-blue-900/20 text-blue-400">✏️</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(h.id)} className="hover:bg-red-900/20 text-red-400">🗑️</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <HoldingModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSaveHolding}
            initialData={editingHolding}
          />

          {currentView === 'analysis' && (
            <Card className="bg-slate-900 border-slate-800 text-white min-h-[500px]">
              <CardHeader><CardTitle>Market Analysis</CardTitle></CardHeader>
              <CardContent>
                <p className="text-slate-400">Deep dive market analysis tools.</p>
              </CardContent>
            </Card>
          )}

          {currentView === 'settings' && (
            <Card className="bg-slate-900 border-slate-800 text-white min-h-[500px]">
              <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
              <CardContent>
                <p className="text-slate-400">User configuration and API keys.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: AI Chat */}
        <div className="md:col-span-1 h-[600px] md:h-full flex flex-col">
          <Card className="flex-1 bg-slate-900 border-slate-800 text-white flex flex-col shadow-2xl">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                Market Analyst
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden pt-4">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                        }`}>
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-sm text-slate-400 text-xs flex items-center gap-1">
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Data analysis for AAPL..."
                  className="bg-slate-950 border-slate-700 text-white focus-visible:ring-blue-500"
                />
                <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-500 shrink-0">
                  <span className="sr-only">Send</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
