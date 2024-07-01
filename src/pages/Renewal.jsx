import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";

const FormPage = () => {
    const [siteLink, setSiteLink] = useState('');
    const [months, setMonths] = useState('2');
    const [currency, setCurrency] = useState('USDTBSC');
    const [walletAddress, setWalletAddress] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleInputChange = (e) => {
        setSiteLink(e.target.value);
    };

    const handleMonthsChange = (value) => {
        setMonths(value);
    };

    const handleCurrencyChange = (value) => {
        setCurrency(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.info("Initiating payment...");
        let api = `https://sentinel.solidhash.io/peripheral-license/license/renew/nowpayments/${siteLink}/${months}/${currency}`
        try {
            let data = await fetch(api);
            console.log(data)
            if (data.status == 404) {
                toast.error("Invalid Site Link")
                return;
            }

            let json = await data.json();

            if (data.status == 400) {
                toast.error(`${json.message}, possible cause :  ${json.possible_cause || ""}`)
                return;
            }

            const address = json?.pay_address; // Replace with the actual wallet address logic
            const amount = json?.pay_amount; // Replace with the actual amount calculation logic
            setWalletAddress(address);
            setTotalAmount(amount);
            setFormSubmitted(true);


            // console.log(json)
        } catch (e) {
            console.log(e)
        }


        toast.dismiss();


    };

    const calculateAmount = (months, currency) => {
        // Implement the actual amount calculation logic here
        // For demonstration, let's assume the cost is $10 per month
        const rate = 10;
        return rate * months + ' ' + currency;
    };

    const handleBack = () => {
        setFormSubmitted(false);
        setSiteLink('');
        setMonths('');
        setCurrency('');
        setWalletAddress('');
        setTotalAmount('');
    };

    return (
        <div className="w-[90%] mx-auto py-12 flex items-start justify-center">
            <div className="flex items-center justify-center max-w-2xl w-full border p-8 rounded shadow-lg bg-gray-900">
                <div className="mx-auto grid gap-6 w-full">
                    {formSubmitted ? (
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-white">Payment Details</h1>
                            <p className="text-white mt-4">Wallet Address:</p>
                            <p className="text-blue-500">{walletAddress}</p>
                            <p className="text-white mt-4">Total Amount:</p>
                            <p className="text-blue-500">{totalAmount}</p>

                            <p className="text-white mt-4">Currency:</p>
                            <p className="text-blue-500">{currency}</p>
                            <p className="text-white mt-4">Paying for:</p>
                            <p className="text-blue-500">{siteLink}</p>

                            <p className="text-white mt-4">Address Expires in:</p>
                            <p className="text-blue-500">{`15 Minutes`}</p>
                            <Button onClick={handleBack} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
                                Back
                            </Button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold text-white">Renew Subscription</h1>
                            <form className="grid gap-4" onSubmit={handleSubmit}>
                                <div className="grid gap-2">
                                    <Label htmlFor="siteLink" className="text-white">Site Link</Label>
                                    <Input
                                        id="siteLink"
                                        name="siteLink"
                                        type="text"
                                        placeholder="Enter site link"
                                        value={siteLink}
                                        onChange={handleInputChange}
                                        className="bg-gray-800 text-white placeholder-gray-500"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="months" className="text-white">Months to Renew</Label>
                                    <Select
                                        value={months}
                                        onValueChange={handleMonthsChange}
                                    >
                                        <SelectTrigger className="bg-gray-800 text-white">
                                            <SelectValue placeholder="Select number of months" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 text-white">
                                            {[1, 2, 3, 6, 12, 24, 36, 48].map((month) => (
                                                <SelectItem value={month.toString()} key={month}>
                                                    {month} {month > 1 ? 'months' : 'month'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="currency" className="text-white">Payment Currency</Label>
                                    <Select
                                        value={currency}
                                        onValueChange={handleCurrencyChange}
                                    >
                                        <SelectTrigger className="bg-gray-800 text-white">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 text-white">
                                            {["USDTBSC", "USDTTRC20", "USDTSOL", "BTC", "TRX", "LTC", "ETH", "BNBBSC"].map((curr) => (
                                                <SelectItem value={curr} key={curr}>
                                                    {curr}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
                                    Submit
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormPage;
