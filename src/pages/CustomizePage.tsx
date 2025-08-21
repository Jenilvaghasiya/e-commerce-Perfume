+import React from 'react';
+import { motion } from 'framer-motion';
+import PerfumeCustomizer from '../components/PerfumeCustomizer';
+
+const CustomizePage: React.FC = () => {
+  return (
+    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
+      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
+        {/* Header */}
+        <motion.div 
+          className="text-center mb-12"
+          initial={{ opacity: 0, y: 30 }}
+          animate={{ opacity: 1, y: 0 }}
+          transition={{ duration: 0.8 }}
+        >
+          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 mb-4">
+            Create Your Signature Scent
+          </h1>
+          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
+            Design a unique fragrance that reflects your personality. Choose from premium ingredients 
+            to create your perfect scent combination with our expert perfumers.
+          </p>
+        </motion.div>
+
+        {/* Customizer Component */}
+        <motion.div
+          initial={{ opacity: 0, y: 20 }}
+          animate={{ opacity: 1, y: 0 }}
+          transition={{ duration: 0.8, delay: 0.2 }}
+        >
+          <PerfumeCustomizer />
+        </motion.div>
       </div>
     </div>
   );
 };
 
-export default ShopPage;
+export default CustomizePage;