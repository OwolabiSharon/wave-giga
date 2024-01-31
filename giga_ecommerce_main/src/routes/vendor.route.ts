import { Router } from 'express';
import VendorController from '../controllers/vendor.controller';


const router = Router();

router.post('/', VendorController.createVendor);
router.get('/', VendorController.getAllVendors);
router.get('/info', VendorController.getAllVendorsInfo);
router.get('/:id', VendorController.getVendor);
router.put('/:id', VendorController.updateVendor);
router.delete('/:id', VendorController.deleteVendor);
router.put('/:id/activate', VendorController.activateVendor);
router.put('/:id/deactivate', VendorController.deactivateVendor);
router.put('/:id/KYC', VendorController.addKYC);
router.put('/:id/bankDetails', VendorController.addBankDetails);
router.put('/:id/blacklist', VendorController.blacklistVendor);
router.put('/:id/unblacklist', VendorController.unBlacklistVendor);
router.put('/:id/report', VendorController.reportVendor);
router.put('/:id/clear-report', VendorController.clearReport);
router.put('/:id/rate', VendorController.rateVendor);










export default router;