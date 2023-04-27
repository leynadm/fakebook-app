declare module "*.png" {
    const value: string;
    export default value;
    export const type: "image/png";
  }
  
  declare module "*.jpeg" {
    const value: string;
    export default value;
    export const type: "imagejpeg";
  }