import React, { lazy } from "react";
import styles from "./InvoicePage.module.css";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { productData } from "./ProductData";
import SearchText from "./SearchText";
import InvoiceFormModal from "./InvoiceFormModal";
import { FaTrashAlt } from "react-icons/fa";
import InputFieldForm from "./InputFieldForm";
import PrimaryButton from "./PrimaryButton";

const initialForm = {
    date: "",
    customer: "",
    salesPerson: "",
    notes: "",
};

const InvoicePage = () => {
    const [showForm, setShowForm] = React.useState(false);
    const [productAdded, setProductAdded] = React.useState([]);
    const [invoiceForm, setInvoiceForm] = React.useState(initialForm);
    const [errorFormMessage, setErrorFormMessage] = React.useState(initialForm);

    const handleShowForm = () => {
        setShowForm(!showForm);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setInvoiceForm({ ...invoiceForm, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let hasError = false;
        let newErrors = { ...errorFormMessage };

        if (invoiceForm.date === "") {
            newErrors.date = "Date is required.";
            hasError = true;
        }
        if (invoiceForm.customer.trim() === "") {
            newErrors.customer = "Customer name is required.";
            hasError = true;
        }
        if (invoiceForm.salesPerson.trim() === "") {
            newErrors.salesPerson = "Sales person is required.";
            hasError = true;
        }

        setErrorFormMessage(newErrors);

        if (!hasError) {
            console.log("Form submitted:", invoiceForm);
            setErrorFormMessage(initialForm);
        }
    };

    const handleOnSelect = (item) => {
        // date, customer, salesPerson, notes, products
        let obj = {
            id: item.id,
            item: item.name,
            quantity: 1,
            price: item.price,
        };

        setProductAdded([...productAdded, obj]);
    };

    const handleIncrement = (id) => {
        setProductAdded((prevProductAdded) => {
            const productExists = prevProductAdded.find((prod) => prod.id === id);

            if (productExists) {
                return prevProductAdded.map((prod) =>
                    prod.id === id ? { ...prod, quantity: prod.quantity + 1 } : prod
                );
            }
        });
    };

    const handleDecrement = (id) => {
        setProductAdded((prevProductAdded) => {
            const productExists = prevProductAdded.find((prod) => prod.id === id);

            if (productExists && productExists.quantity > 1) {
                return prevProductAdded.map((prod) =>
                    prod.id === id ? { ...prod, quantity: prod.quantity - 1 } : prod
                );
            } else {
                return prevProductAdded.filter((prod) => prod.id !== id);
            }
        });
    };

    const handleDeleteProduct = (id) => {
        const filtered = productAdded.filter((item) => item.id !== id);

        setProductAdded(filtered);
    };

    const handleCloseModal = () => {
        setProductAdded([]);
        setShowForm(false);
        setInvoiceForm(initialForm);
        setErrorFormMessage(initialForm);
    };

    const searchList = React.useMemo(() => {
        const filtered = productData.filter(
            (item) => !productAdded.some((addedItem) => item.id === addedItem.id)
        );
        return filtered;
    }, [productAdded]);

    const totalPrice = React.useMemo(() => {
        if (productAdded.length > 0) {
            const total = productAdded.reduce((acc, product) => {
                return acc + product.price * product.quantity;
            }, 0);
            return total.toLocaleString("id-ID");
        } else {
            return 0;
        }
    }, [productAdded]);

    return (
        <div className={styles.container}>
            <div className={styles.mainContainer}>
                <div className={styles.header}>
                    <h1>Invoice List</h1>
                    <button className={styles.addButton} onClick={handleShowForm}>
                        Add Invoice
                    </button>
                </div>

                <br />
                <br />
            </div>
            <InvoiceFormModal isOpen={showForm}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h3>Add new invoice</h3>
                    <button
                        style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            fontSize: "medium",
                            background: "none",
                        }}
                        onClick={handleCloseModal}
                    >
                        x
                    </button>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginBottom: "15px",
                    }}
                >
                    <InputFieldForm
                        type={"date"}
                        required={true}
                        placeholder="date"
                        value={invoiceForm.date}
                        name="date"
                        onChange={handleInputChange}
                        showErrorMessage={errorFormMessage.date.length > 0 ? true : false}
                        errorMessage={errorFormMessage.date}
                    />

                    <InputFieldForm
                        required={true}
                        name={"customer"}
                        onChange={handleInputChange}
                        placeholder={"Customer"}
                        value={invoiceForm.customer}
                        showErrorMessage={errorFormMessage.customer.length > 0 ? true : false}
                        errorMessage={errorFormMessage.customer}
                    />
                    <InputFieldForm
                        required={true}
                        name={"salesPerson"}
                        onChange={handleInputChange}
                        placeholder={"Sales Person"}
                        value={invoiceForm.salesPerson}
                        showErrorMessage={errorFormMessage.salesPerson.length > 0 ? true : false}
                        errorMessage={errorFormMessage.salesPerson}
                    />

                    <textarea
                        onChange={handleInputChange}
                        name="notes"
                        placeholder="Notes"
                        value={invoiceForm.notes}
                    />
                </div>
                <div
                    style={{
                        width: "100%",
                    }}
                >
                    <ReactSearchAutocomplete
                        items={searchList}
                        placeholder="Search your product here"
                        showNoResultsText="Sorry, your product is empty"
                        onSelect={handleOnSelect}
                        autoFocus
                        formatResult={(item) => {
                            return (
                                <div className={styles.searchResultContainer}>
                                    <img
                                        className={styles.productImg}
                                        src={`${item.link}${item.id}`}
                                    />
                                    <div className={styles.midContainer}>
                                        <SearchText text={item.name} />
                                        <SearchText text={item.quantity} />
                                    </div>
                                    <SearchText text={item.price.toLocaleString("id-ID")} />
                                </div>
                            );
                        }}
                    />
                </div>

                {productAdded.length > 0 ? (
                    <>
                        {productAdded.map((item, i) => {
                            return (
                                <div
                                    key={i}
                                    style={{
                                        minHeight: "50px",
                                        padding: "10px",
                                        borderBottom: "1px solid grey",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <span>{item.item}</span>
                                        <span>
                                            {(item.price * item.quantity).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            gap: "10px",
                                        }}
                                    >
                                        <button onClick={() => handleDeleteProduct(item.id)}>
                                            <FaTrashAlt />
                                        </button>

                                        <button onClick={() => handleDecrement(item.id)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleIncrement(item.id)}>+</button>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : (
                    <></>
                )}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "15px 0",
                    }}
                >
                    <h3>Total Price:</h3>
                    <h3>{totalPrice}</h3>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px",
                    }}
                >
                    <PrimaryButton
                        onClick={handleCloseModal}
                        style={{
                            backgroundColor: "lightgrey",
                        }}
                        title={"Cancel"}
                    />
                    <PrimaryButton
                        style={{
                            backgroundColor: "lightblue",
                        }}
                        title={"Submit"}
                        onClick={handleSubmit}
                    />
                </div>
            </InvoiceFormModal>
        </div>
    );
};

export default InvoicePage;
