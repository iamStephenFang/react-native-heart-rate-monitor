//
//  HRFrameProcessorPlugin.swift
//
//  Created by StephenFang on 2022/12/13.
//

import Foundation

@objc(HRFrameProcessorPlugin)
public class HRFrameProcessorPlugin: NSObject, FrameProcessorPluginBase {
  static var pulseDetector = PulseDetector()
  static var hueFilter = Filter()
  
  static var BPM: Int = 0;
  static var state: String = "RECORDING";
  static var validFrameCounter = 0
  
  @objc
  public static func callback(_ frame: Frame!, withArgs args: [Any]!) -> Any! {
    var redmean: CGFloat = 0.0;
    var greenmean: CGFloat = 0.0;
    var bluemean: CGFloat = 0.0;

    guard let pixelBuffer = CMSampleBufferGetImageBuffer(frame.buffer) else {
      print("Failed to get CVPixelBuffer!")
      return nil
    }
    let cameraImage = CIImage(cvPixelBuffer: pixelBuffer)

    if !args.isEmpty {
      if let shouldReset = args[0] as? NSString {
        if shouldReset == "true" {
          validFrameCounter = 0
          pulseDetector.reset()
          state = "BEGIN"
          BPM = 0
        }
      }
    }
    
    let extent = cameraImage.extent
    let inputExtent = CIVector(x: extent.origin.x, y: extent.origin.y, z: extent.size.width, w: extent.size.height)
    let averageFilter = CIFilter(name: "CIAreaAverage",
                                 parameters: [kCIInputImageKey: cameraImage, kCIInputExtentKey: inputExtent])!
    let outputImage = averageFilter.outputImage!
    
    let ctx = CIContext(options:nil)
    let cgImage = ctx.createCGImage(outputImage, from:outputImage.extent)!
    
    let rawData:NSData = cgImage.dataProvider!.data!
    let pixels = rawData.bytes.assumingMemoryBound(to: UInt8.self)
    let bytes = UnsafeBufferPointer<UInt8>(start:pixels, count:rawData.length)
    var BGRA_index = 0
    for pixel in UnsafeBufferPointer(start: bytes.baseAddress, count: bytes.count) {
      switch BGRA_index {
      case 0:
        bluemean = CGFloat (pixel)
      case 1:
        greenmean = CGFloat (pixel)
      case 2:
        redmean = CGFloat (pixel)
      case 3:
        break
      default:
        break
      }
      BGRA_index += 1
    }
    
    let hsv = rgb2hsv((red: redmean, green: greenmean, blue: bluemean, alpha: 1.0))
    if (hsv.1 > 0.5 && hsv.2 > 0.5) {
      state = "RECORDING"
      BPM = lroundf(60.0/pulseDetector.getAverage())
      validFrameCounter += 1
      
      // Filter the hue value - the filter is a simple BAND PASS FILTER that removes any DC component and any high frequency noise
      if validFrameCounter > 60 {
        let filtered = hueFilter.processValue(value: Double(hsv.0))
        pulseDetector.addNewValue(newVal: filtered, atTime: CACurrentMediaTime())
      }
    } else {
      validFrameCounter = 0
      pulseDetector.reset()
      state = "BEGIN"
      BPM = 0
    }
    
    return [
      "BPM": BPM,
      "state": state,
      "count": validFrameCounter
    ]
  }
}

