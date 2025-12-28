"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const COMMON_FIELDS = [
    { name: "investment_thesis", label: "Investment Thesis", type: "textarea", placeholder: "Why did you buy this?" },
    { name: "conviction_level", label: "Conviction Level", type: "select", options: ["Low", "Medium", "High", "Very High"] },
    { name: "risks", label: "Risks / Red Flags", type: "textarea", placeholder: "What could go wrong?" },
    { name: "target_value", label: "Target Value / Exit Goal", type: "number", placeholder: "Target Price" },
    { name: "time_horizon", label: "Time Horizon", type: "select", options: ["Short Term", "Medium Term", "Long Term"] },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Additional notes..." },
];

const ASSET_SPECIFIC_FIELDS: any = {
    STOCK: [
        { name: "sector", label: "Sector / Industry", type: "text" },
        { name: "dividend_yield", label: "Dividend Yield", type: "number" }
    ],
    INDEX_FUND: [
        { name: "fund_type", label: "Fund Type", type: "select", options: ["Index", "Debt", "Hybrid", "Thematic"] },
        { name: "expense_ratio", label: "Expense Ratio (%)", type: "number" },
        { name: "amc", label: "AMC Name", type: "text" },
        { name: "sip_enabled", label: "SIP Enabled", type: "select", options: ["Yes", "No"] }
    ],
    GOLD: [
        { name: "gold_type", label: "Type", type: "select", options: ["Physical", "ETF", "Digital"] },
        { name: "purity", label: "Purity (Carats)", type: "text" },
        { name: "storage", label: "Storage Location", type: "text" },
        { name: "making_charges", label: "Making Charges", type: "number" }
    ],
    CHIT_FUND: [
        { name: "group_name", label: "Chit Group Name", type: "text" },
        { name: "chit_value", label: "Total Chit Value", type: "number" },
        { name: "monthly_contribution", label: "Monthly Contribution", type: "number" },
        { name: "duration_months", label: "Duration (Months)", type: "number" },
        { name: "start_date", label: "Start Date", type: "date" },
        { name: "end_date", label: "End Date", type: "date" },
        { name: "organizer", label: "Organizer", type: "text" },
        { name: "payout_received", label: "Payout Received?", type: "select", options: ["Yes", "No"] }
    ]
};

export function HoldingModal({ isOpen, onClose, onSubmit, initialData }: any) {
    const [formData, setFormData] = useState<any>({
        symbol: "", quantity: "", average_price: "", asset_type: "STOCK", details: {}
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                details: initialData.details || {}
            });
        } else {
            setFormData({ symbol: "", quantity: "", average_price: "", asset_type: "STOCK", details: {} });
        }
    }, [initialData, isOpen]);

    const handleChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleDetailChange = (key: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            details: { ...prev.details, [key]: value }
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const assetFields = ASSET_SPECIFIC_FIELDS[formData.asset_type] || [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-slate-800">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Investment" : "Add New Investment"}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Core Fields */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-emerald-400 uppercase">Core Details</h3>
                        <div>
                            <Label>Asset Type</Label>
                            <select
                                value={formData.asset_type}
                                onChange={(e) => handleChange("asset_type", e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm"
                            >
                                {Object.keys(ASSET_SPECIFIC_FIELDS).map(t => <option key={t} value={t}>{t}</option>)}
                                <option value="REAL_ESTATE">REAL ESTATE</option>
                                <option value="FD">FIXED DEPOSIT</option>
                            </select>
                        </div>
                        <div>
                            <Label>{formData.asset_type === 'GOLD' ? 'Name' : 'Symbol / Ticker'}</Label>
                            <Input value={formData.symbol} onChange={e => handleChange("symbol", e.target.value)} className="bg-slate-950 border-slate-800" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Quantity</Label>
                                <Input type="number" value={formData.quantity} onChange={e => handleChange("quantity", e.target.value)} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div>
                                <Label>Avg Price</Label>
                                <Input type="number" value={formData.average_price} onChange={e => handleChange("average_price", e.target.value)} className="bg-slate-950 border-slate-800" />
                            </div>
                        </div>

                        {/* Common Extra Fields */}
                        <div className="space-y-2 mt-4">
                            {COMMON_FIELDS.map((field) => (
                                <div key={field.name}>
                                    <Label className="text-xs text-slate-400">{field.label}</Label>
                                    {field.type === 'select' ? (
                                        <select
                                            value={formData[field.name] || ""}
                                            onChange={e => handleChange(field.name, e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm"
                                        >
                                            <option value="">Select...</option>
                                            {field.options?.map((o: string) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    ) : field.type === 'textarea' ? (
                                        <Textarea
                                            value={formData[field.name] || ""}
                                            onChange={e => handleChange(field.name, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="bg-slate-950 border-slate-800 min-h-[60px]"
                                        />
                                    ) : (
                                        <Input
                                            type={field.type}
                                            value={formData[field.name] || ""}
                                            onChange={e => handleChange(field.name, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="bg-slate-950 border-slate-800"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Specific Fields */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-blue-400 uppercase">Asset Specifics</h3>
                        {assetFields.length === 0 ? <p className="text-slate-500 text-sm">No specific fields for this asset type.</p> : (
                            assetFields.map((field: any) => (
                                <div key={field.name}>
                                    <Label className="text-xs text-slate-400">{field.label}</Label>
                                    {field.type === 'select' ? (
                                        <select
                                            value={formData.details?.[field.name] || ""}
                                            onChange={e => handleDetailChange(field.name, e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm"
                                        >
                                            <option value="">Select...</option>
                                            {field.options?.map((o: string) => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    ) : (
                                        <Input
                                            type={field.type}
                                            value={formData.details?.[field.name] || ""}
                                            onChange={e => handleDetailChange(field.name, e.target.value)}
                                            className="bg-slate-950 border-slate-800"
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-500">Save Investment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
