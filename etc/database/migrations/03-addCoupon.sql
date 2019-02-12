ALTER TABLE `self.academy`.`courses`
  ADD COLUMN `coupon` VARCHAR(20) NULL DEFAULT NULL AFTER `price`,
  ADD COLUMN `couponDiscount` FLOAT NULL DEFAULT NULL AFTER `coupon`;
