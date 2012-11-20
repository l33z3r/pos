var productsStorageKey = "sales_resource_products";
var products_by_upcStorageKey = "sales_resource_products_by_upc";
var non_deleted_productsStorageKey = "sales_resource_non_deleted_products";
var stock_productsStorageKey = "sales_resource_stock_products";

var paymentMethodsStorageKey = "sales_resources_payment_methods";
var expensesStorageKey = "sales_resources_cash_out_presets";

var printersStorageKey = "sales_resources_printers";
var printerNetworkPathsStorageKey = "sales_resources_printer_network_paths";
var printersByIDStorageKey = "sales_resources_printers_by_id";

var outletTerminalsStorageKey = "sales_resources_outlet_terminals";
var assignedOutletTerminalsStorageKey = "sales_resources_assigned_outlet_terminals";
var availableOutletTerminalsStorageKey = "sales_resources_available_outlet_terminals";

var creditCustomersStorageKey = "sales_resources_credit_customers";
var loyaltyCustomersStorageKey = "sales_resources_loyalty_customers";
var loyaltyCustomersByCodeStorageKey = "sales_resources_customers_by_code";

var loyaltyLevelsStorageKey = "sales_resources_loyalty_levels";
var employeesStorageKey = "sales_resources_employees";
var all_display_button_permissionsStorageKey = "sales_resources_button_permissions";
var modifier_categoriesStorageKey = "sales_resources_modifier_categories";
var categoriesStorageKey = "sales_resources_categories";
var roomsStorageKey = "sales_resources_rooms";
var tablesStorageKey = "sales_resources_tables";

function initSalesResources() {
    //PAYMENT METHODS
    if(typeof(paymentMethods) != "undefined") {
        storeSalesResourceInStorage(paymentMethodsStorageKey, paymentMethods);
    } else {
        console.log("loading payment methods from storage");
        paymentMethods = getSalesResourceFromStorage(paymentMethodsStorageKey);        
    }
    
    //EXPENSES
    if(typeof(cashOutPresets) != "undefined") {
        storeSalesResourceInStorage(expensesStorageKey, cashOutPresets);
    } else {
        console.log("loading expenses from storage");
        cashOutPresets = getSalesResourceFromStorage(expensesStorageKey);        
    }
    
    //PRINTERS
    if(typeof(printers) != "undefined") {
        storeSalesResourceInStorage(printersStorageKey, printers);
        storeSalesResourceInStorage(printerNetworkPathsStorageKey, printerNetworkPaths);
        storeSalesResourceInStorage(printersByIDStorageKey, printersByID);
    } else {
        console.log("loading printers expenses from storage");
        printers = getSalesResourceFromStorage(printersStorageKey);
        printerNetworkPaths = getSalesResourceFromStorage(printerNetworkPathsStorageKey);        
        printersByID = getSalesResourceFromStorage(printersByIDStorageKey); 
    }
    
    //OUTLET TERMINALS
    if(typeof(outletTerminals) != "undefined") {
        storeSalesResourceInStorage(outletTerminalsStorageKey, outletTerminals);
        storeSalesResourceInStorage(assignedOutletTerminalsStorageKey, assignedOutletTerminals);
        storeSalesResourceInStorage(availableOutletTerminalsStorageKey, availableOutletTerminals);
    } else {
        console.log("loading terminals from storage");
        outletTerminals = getSalesResourceFromStorage(outletTerminalsStorageKey);
        assignedOutletTerminals = getSalesResourceFromStorage(assignedOutletTerminalsStorageKey);        
        availableOutletTerminals = getSalesResourceFromStorage(availableOutletTerminalsStorageKey); 
    }
    
    //CUSTOMERS
    if(typeof(creditCustomers) != "undefined") {
        storeSalesResourceInStorage(creditCustomersStorageKey, creditCustomers);
        storeSalesResourceInStorage(loyaltyCustomersStorageKey, loyaltyCustomers);
        storeSalesResourceInStorage(loyaltyCustomersByCodeStorageKey, loyaltyCustomersByCode);
    } else {
        console.log("loading customers from storage");
        creditCustomers = getSalesResourceFromStorage(creditCustomersStorageKey);
        loyaltyCustomers = getSalesResourceFromStorage(loyaltyCustomersStorageKey);        
        loyaltyCustomersByCode = getSalesResourceFromStorage(loyaltyCustomersByCodeStorageKey); 
    }
    
    //LOYALTY LEVELS
    if(typeof(loyaltyLevels) != "undefined") {
        storeSalesResourceInStorage(loyaltyLevelsStorageKey, loyaltyLevels);
    } else {
        console.log("loading loyalty levels from storage");
        loyaltyLevels = getSalesResourceFromStorage(loyaltyLevelsStorageKey);        
    }
    
    //EMPLOYEES
    if(typeof(employees) != "undefined") {
        storeSalesResourceInStorage(employeesStorageKey, employees);
    } else {
        console.log("loading employees from storage");
        employees = getSalesResourceFromStorage(employeesStorageKey);        
    }
    
    //BUTTON PERMISSIONS
    if(typeof(all_display_button_permissions) != "undefined") {
        storeSalesResourceInStorage(all_display_button_permissionsStorageKey, all_display_button_permissions);
    } else {
        console.log("loading button permissions from storage");
        all_display_button_permissions = getSalesResourceFromStorage(all_display_button_permissionsStorageKey);        
    }
    
    //PRODUCTS
    if(typeof(products) != "undefined") {
        storeSalesResourceInStorage(productsStorageKey, products);
        storeSalesResourceInStorage(products_by_upcStorageKey, products_by_upc);
        storeSalesResourceInStorage(non_deleted_productsStorageKey, non_deleted_products);
        storeSalesResourceInStorage(stock_productsStorageKey, stock_products);
    } else {
        console.log("loading proudcts from storage");
        products = getSalesResourceFromStorage(productsStorageKey);
        products_by_upc = getSalesResourceFromStorage(products_by_upcStorageKey);        
        non_deleted_products = getSalesResourceFromStorage(non_deleted_productsStorageKey); 
        stock_products = getSalesResourceFromStorage(stock_productsStorageKey); 
    }
    
    //MODIFIER CATEGORIES
    if(typeof(modifier_categories) != "undefined") {
        storeSalesResourceInStorage(modifier_categoriesStorageKey, modifier_categories);
    } else {
        console.log("loading modifier categories from storage");
        modifier_categories = getSalesResourceFromStorage(modifier_categoriesStorageKey);        
    }
    
    //CATEGORIES
    if(typeof(categories) != "undefined") {
        storeSalesResourceInStorage(categoriesStorageKey, categories);
    } else {
        console.log("loading categories from storage");
        categories = getSalesResourceFromStorage(categoriesStorageKey);        
    }
    
    //ROOMS
    if(typeof(rooms) != "undefined") {
        storeSalesResourceInStorage(roomsStorageKey, rooms);
    } else {
        console.log("loading rooms from storage");
        rooms = getSalesResourceFromStorage(roomsStorageKey);        
    }
    
    //TABLES
    if(typeof(tables) != "undefined") {
        storeSalesResourceInStorage(tablesStorageKey, tables);
    } else {
        console.log("loading button tables from storage");
        tables = getSalesResourceFromStorage(tablesStorageKey);        
    }
}

function storeSalesResourceInStorage(key, resource) {
    var value = JSON.stringify(resource);
    return storeKeyValue(key, value);
}

function getSalesResourceFromStorage(key) {
    var salesResourceStorageData = retrieveStorageValue(key);

    if(salesResourceStorageData != null) {
        return JSON.parse(salesResourceStorageData);
    } else {
        niceAlert("Cannot load sales resource (" + key + ") from local storage");
        return null;
    }
}

function doReloadSalesResources(callback) {
    showLoadingDiv("Reloading Sales Resources, Please Wait...");
    
    var complete = function() {
        initSalesResources();
        hideLoadingDiv();
        
        if(typeof(callback) != "undefined") {
            callback.call();
        }
    };
    
    $.ajax({
        url: "/javascripts/sales_resources.js",
        dataType: "script",
        complete: complete
    });
}