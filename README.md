FakeStore - A React Native E-commerce App

A mobile e-commerce application built with React Native and Redux Toolkit. This app provides a seamless shopping experience, featuring product browsing, a dynamic shopping cart with real-time updates, and user authentication. It serves as a practical demonstration of modern mobile development techniques, including state management with Redux and intuitive tab-based navigation.
Features

    Product Catalog: Browse a list of products fetched from an API.

    Dynamic Shopping Cart: Add, remove, and adjust the quantity of items in the cart.

    Real-Time Updates: The cart icon badge and total cost update instantly as items are managed.

    State Management: Utilizes Redux and Redux Toolkit for robust and predictable state management across the application.

    User Authentication: Simple sign-in and sign-up pages.

    Intuitive Navigation: A bottom tab navigator allows for easy switching between the product list and the shopping cart.

    Order History: A dedicated screen to view past orders.

Tech Stack

    Framework: React Native

    State Management: Redux with Redux Toolkit

    Navigation: React Navigation

    Language: JavaScript/JSX

Getting Started

To get a local copy up and running, please follow these simple steps.
Prerequisites

Make sure you have set up your development environment for React Native.

    Node.js & npm/yarn

    Watchman (for macOS)

    React Native CLI

    Xcode (for iOS development)

    Android Studio (for Android development)

For detailed instructions, please follow the official React Native Environment Setup Guide.
Installation & Setup

    Clone the Repository:

    git clone [https://github.com/VaibhavJha-github/MADAssignment2.git](https://github.com/VaibhavJha-github/MADAssignment2.git)
    cd MADAssignment2

    Install Dependencies:

    npm install

    or if you use Yarn:

    yarn install

    Install iOS Pods:

    cd ios && pod install && cd ..

Running the Application

    Start the Metro Bundler:
    Open a terminal in the project's root directory and run:

    npx react-native start

    Run on a Simulator/Emulator:
    Keep the Metro bundler terminal open and run one of the following commands in a new terminal tab:

        For iOS:

        npx react-native run-ios

        For Android:

        npx react-native run-android

License

Distributed under the MIT License. See LICENSE.txt for more information.
